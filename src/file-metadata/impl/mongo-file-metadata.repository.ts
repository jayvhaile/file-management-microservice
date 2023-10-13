import { FileMetadataSchema } from "../file-metadata.schema";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { FileMetadataRepository } from "../file-metadata.repository";
import { FileMetadata } from "../file-metadata";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MongoFileMetadataRepository implements FileMetadataRepository {

  constructor(
    @InjectRepository(FileMetadataSchema)
    private repo: MongoRepository<FileMetadataSchema>
  ) {
  }

  async create(file: FileMetadata): Promise<FileMetadata> {
    return this.repo.save(mapModelToSchema(file)).then(mapSchemaToModel);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ _id: ObjectId.createFromHexString(id) });
  }

  async findByHash(hash: string): Promise<FileMetadata | null> {
    let fileMetadataSchema = await this.repo.findOne({ where: { hash: hash } });
    if (!fileMetadataSchema) return null;
    return mapSchemaToModel(fileMetadataSchema);
  }

  async findById(id: string): Promise<FileMetadata | null> {
    let fileMetadataSchema = await this.repo.findOne({ where: { _id: ObjectId.createFromHexString(id) } });
    if (!fileMetadataSchema) return null;
    return mapSchemaToModel(fileMetadataSchema);
  }

  async findByReferenceId(referenceId: string): Promise<FileMetadata | null> {
    let fileMetadataSchema = await this.repo.findOne({ where: { referenceId } });
    if (!fileMetadataSchema) return null;
    return mapSchemaToModel(fileMetadataSchema);
  }


}

function mapSchemaToModel(fileMetadataSchema: FileMetadataSchema): FileMetadata {
  return ({
    id: fileMetadataSchema._id.toString(),
    hash: fileMetadataSchema.hash,
    referenceId: fileMetadataSchema.referenceId,
    name: fileMetadataSchema.name,
    folder: fileMetadataSchema.folder,
    size: fileMetadataSchema.size,
    mimeType: fileMetadataSchema.mimeType,
    extension: fileMetadataSchema.extension,
    createdAt: fileMetadataSchema.createdAt
  });
}

function mapModelToSchema(fileMetadata: FileMetadata): FileMetadataSchema {
  return ({
    _id: ObjectId.createFromHexString(fileMetadata.id),
    hash: fileMetadata.hash,
    referenceId: fileMetadata.referenceId,
    name: fileMetadata.name,
    folder: fileMetadata.folder,
    size: fileMetadata.size,
    mimeType: fileMetadata.mimeType,
    extension: fileMetadata.extension,
    createdAt: fileMetadata.createdAt
  });
}