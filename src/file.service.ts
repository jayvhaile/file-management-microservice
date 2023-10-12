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

  async upload(file: FileData): Promise<Either<UploadFileFailure, FileMetadata>> {
    const fileHash = crypto.createHash("md5").update(file.data).digest("hex");
    const fileId = new ObjectId().toHexString();

    const existing = await this.fileMetadataRepository.findByHash(fileHash);

    if (existing) return Right(existing);

    if (file.data.length == 0) return Left({ type: "EmptyFileContent" });

    if (file.data.length > MAX_FILE_SIZE) return Left({ type: "FileSizeTooLarge" });

    const extension = file.name.split(".").pop();

    const fullPath = `${file.folder}/${fileId}.${extension}`;

    try {
      await this.fileStorageRepository.upload(file.data, fullPath);
    } catch (e) {
      return Left({ type: "FileStorageFailure", message: e.message });
    }

    const fileMetadata: FileMetadata = {
      id: fileId,
      hash: fileHash,
      name: file.name,
      folder: file.folder,
      size: file.data.length,
      mimeType: file.mimeType,
      extension: extension,
      createdAt: new Date()
    };

    return Right(await this.fileMetadataRepository.create(fileMetadata));
  }

  async delete(id: string): Promise<Either<any, {}>> {
    const metadata = await this.fileMetadataRepository.findById(id);
    if (!metadata) return Left({ type: "FileNotFound" });
    await this.fileMetadataRepository.delete(id);
    await this.fileStorageRepository.delete(`${metadata.folder}/${metadata.id}.${metadata.extension}`);
    return Right({});
  }

  async download(id: string): Promise<Either<DownloadFileFailure, FileMetadata & { data: Buffer }>> {
    const metadata = await this.fileMetadataRepository.findById(id);
    if (!metadata) return Left({ type: "FileNotFound" });

    const data = await this.fileStorageRepository.download(`${metadata.folder}/${metadata.id}.${metadata.extension}`);

    return Right({ ...metadata, data });
  }

  async getDownloadUrl(id: string): Promise<Either<DownloadFileFailure, string>> {
    const metadata = await this.fileMetadataRepository.findById(id);
    if (!metadata) return Left({ type: "FileNotFound" });

    return Right(await this.fileStorageRepository.getDownloadUrl(`${metadata.folder}/${metadata.id}.${metadata.extension}`));
  }
}


const MEGA_BYTE = 1024 * 1024;

export const MAX_FILE_SIZE = MEGA_BYTE * 50;

export type UploadFileFailure =
  | { type: "FileSizeTooLarge" }
  | { type: "FileStorageFailure", message?: string }
  | { type: "EmptyFileContent" }

export type DownloadFileFailure =
  | { type: "FileNotFound" }
  | { type: "FileStorageFailure", message?: string }
