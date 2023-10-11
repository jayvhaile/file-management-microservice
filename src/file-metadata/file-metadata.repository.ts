import {FileMetadata} from "./file-metadata";

export abstract class FileMetadataRepository {
    abstract findById(id: string): Promise<FileMetadata>

    abstract findByHash(hash: string): Promise<FileMetadata>

    abstract create(file: FileMetadata): Promise<FileMetadata>

    abstract delete(id: string): Promise<void>
}