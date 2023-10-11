import {FileMetadataSchema} from "../file-metadata.schema";
import {InjectRepository} from "@nestjs/typeorm";
import {MongoRepository, ObjectId} from "typeorm";
import {FileMetadataRepository} from "../file-metadata.repository";
import {FileMetadata} from "../file-metadata";

export class MongoFileMetadataRepository implements FileMetadataRepository {

    constructor(
        @InjectRepository(FileMetadataSchema)
        private repo: MongoRepository<FileMetadataSchema>,
    ) {
    }

    async create(file: FileMetadata): Promise<FileMetadata> {
        return this.repo.save(mapModelToSchema(file)).then(mapSchemaToModel);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete({_id: ObjectId.createFromHexString(id)});
    }

    async findByHash(hash: string): Promise<FileMetadata | null> {
        let fileMetadataSchema = await this.repo.findOne({where: {hash: hash}});
        if (!fileMetadataSchema) return null;
        return mapSchemaToModel(fileMetadataSchema);
    }

    async findById(id: string): Promise<FileMetadata | null> {
        let fileMetadataSchema = await this.repo.findOne({where: {_id: ObjectId.createFromHexString(id)}});
        if (!fileMetadataSchema) return null;
        return mapSchemaToModel(fileMetadataSchema);
    }


}

function mapSchemaToModel(fileMetadataSchema: FileMetadataSchema): FileMetadata {
    return ({
        id: fileMetadataSchema._id.toString(),
        hash: fileMetadataSchema.hash,
        name: fileMetadataSchema.name,
        folder: fileMetadataSchema.folder,
        size: fileMetadataSchema.size,
        mimeType: fileMetadataSchema.mimeType,
        createdAt: fileMetadataSchema.createdAt,
    });
}

function mapModelToSchema(fileMetadata: FileMetadata): FileMetadataSchema {
    return ({
        _id: ObjectId.createFromHexString(fileMetadata.id),
        hash: fileMetadata.hash,
        name: fileMetadata.name,
        folder: fileMetadata.folder,
        size: fileMetadata.size,
        mimeType: fileMetadata.mimeType,
        createdAt: fileMetadata.createdAt,
    });
}