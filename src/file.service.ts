import { Injectable } from "@nestjs/common";
import { FileMetadataRepository } from "./file-metadata/file-metadata.repository";
import { FileStorageRepository } from "./file-storage/file-storage.repository";
import { FileMetadata } from "./file-metadata/file-metadata";
import { FileData } from "./models/file-data";
import * as crypto from "crypto";
import { Either, Left, Right } from "purify-ts";
import { ObjectId } from "mongodb";

@Injectable()
export class FileService {

  constructor(
    private readonly fileMetadataRepository: FileMetadataRepository,
    private readonly fileStorageRepository: FileStorageRepository
  ) {
  }

  async upload(request: UploadFileRequest): Promise<Either<UploadFileFailure, FileMetadata>> {
    const fileHash = crypto.createHash("md5").update(request.data).digest("hex");
    const fileId = new ObjectId().toHexString();

    const extension = request.name.split(".").pop();
    const fileMetadata: FileMetadata = {
      id: fileId,
      referenceId: request.referenceId,
      hash: fileHash,
      name: request.name,
      folder: request.folder,
      size: request.data.length,
      mimeType: request.mimeType,
      extension: extension,
      createdAt: new Date()
    };

    const existing = await this.fileMetadataRepository.findByHash(fileHash);

    if (existing && existing.referenceId == request.referenceId) {
      return Right(existing);
    }

    if (request.data.length == 0) return Left({ type: "EmptyFileContent" });

    if (request.data.length > MAX_FILE_SIZE) return Left({ type: "FileSizeTooLarge" });


    const fullPath = `${request.folder}/${fileId}.${extension}`;

    try {
      await this.fileStorageRepository.upload(request.data, fullPath);
    } catch (e) {
      return Left({ type: "FileStorageFailure", message: e.message });
    }


    return Right(await this.fileMetadataRepository.create(fileMetadata));
  }

  async delete(id: string): Promise<Either<any, {}>> {
    //todo check if file is used by other entities
    const metadata = await this.fileMetadataRepository.findById(id);
    if (!metadata) return Left({ type: "FileNotFound" });
    await this.fileMetadataRepository.delete(id);
    await this.fileStorageRepository.delete(`${metadata.folder}/${metadata.id}.${metadata.extension}`);
    return Right({});
  }

  async download(id: string): Promise<Either<DownloadFileFailure, FileMetadata & { data: Buffer }>> {
    const metadata = await this.fileMetadataRepository.findById(id);
    if (!metadata) return Left({ type: "FileNotFound" });

    const path = FileMetadata.toPath(metadata);

    const data = await this.fileStorageRepository.download(path);

    return Right({ ...metadata, data });
  }

  async getDownloadUrlById(id: string): Promise<Either<DownloadFileFailure, string>> {
    return this.fileMetadataRepository
      .findById(id)
      .then(it => this.getDownloadUrl(it));
  }

  async getDownloadUrlByReferenceId(id: string): Promise<Either<DownloadFileFailure, string>> {
    return this.fileMetadataRepository
      .findByReferenceId(id)
      .then(it => this.getDownloadUrl(it));
  }

  private async getDownloadUrl(metadata: FileMetadata | null): Promise<Either<DownloadFileFailure, string>> {
    if (!metadata) return Left({ type: "FileNotFound" });
    const path = FileMetadata.toPath(metadata);

    try {
      return Right(await this.fileStorageRepository.getDownloadUrl(path));
    } catch (e) {
      return Left({ type: "FileStorageFailure", message: e.message });
    }
  }

  async existsById(id: string): Promise<boolean> {
    const metadata = await this.fileMetadataRepository.findById(id);
    if (!metadata) return false;
    return this.fileStorageRepository.exists(FileMetadata.toPath(metadata));
  }

  async existsByReferenceId(id: string): Promise<boolean> {
    const metadata = await this.fileMetadataRepository.findByReferenceId(id);
    if (!metadata) return false;
    return this.fileStorageRepository.exists(FileMetadata.toPath(metadata));
  }
}


const MEGA_BYTE = 1024 * 1024;

export const MAX_FILE_SIZE = MEGA_BYTE * 50;

export type UploadFileRequest = {
  data: Buffer,
  name: string,
  folder: string,
  mimeType: string,
  referenceId: string
}


export type UploadFileFailure =
  | { type: "FileSizeTooLarge" }
  | { type: "FileStorageFailure", message?: string }
  | { type: "EmptyFileContent" }

export type DownloadFileFailure =
  | { type: "FileNotFound" }
  | { type: "FileStorageFailure", message?: string }
