import {Injectable} from '@nestjs/common';
import {FileMetadataRepository} from "./file-metadata/file-metadata.repository";
import {FileStorageRepository} from "./file-storage/file-storage.repository";
import {FileMetadata} from "./file-metadata/file-metadata";
import {FileData} from "./models/file-data";
import * as crypto from 'crypto';
import {Either, Left, Right} from "purify-ts";

@Injectable()
export class FileService {

    constructor(
        private readonly fileMetadataRepository: FileMetadataRepository,
        private readonly fileStorageRepository: FileStorageRepository,
    ) {
    }

    async upload(file: FileData): Promise<Either<UploadFileFailure, FileMetadata>> {
        const fileHash = crypto.createHash('md5').update(file.data).digest('hex');
        const fileId = crypto.randomBytes(16).toString('hex');

        const existing = await this.fileMetadataRepository.findByHash(fileHash);

        if (existing) return Right(existing);

        if(file.data.length==0) return Left({type: 'EmptyFileContent'});

        if(file.data.length>MAX_FILE_SIZE) return Left({type: 'FileSizeTooLarge'});



        const fullPath = `${file.folder}/${fileId}`

        try {
            await this.fileStorageRepository.upload(file.data, fullPath)
        }
        catch (e){
            return Left({type: 'FileStorageFailure', message: e.message});
        }

        const fileMetadata: FileMetadata = {
            id: fileId,
            hash: fileHash,
            name: file.name,
            folder: file.folder,
            size: file.data.length,
            mimeType: file.mimeType,
            createdAt: new Date(),
        }

        return Right(await this.fileMetadataRepository.create(fileMetadata));
    }
}


const MEGA_BYTE = 1024 * 1024;

export const MAX_FILE_SIZE = MEGA_BYTE * 50;

export type UploadFileFailure =
    | { type: 'FileSizeTooLarge' }
    | { type: 'FileStorageFailure', message?:string }
    | { type: 'EmptyFileContent' }
