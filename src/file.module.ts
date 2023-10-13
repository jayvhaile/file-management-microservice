import { Module } from "@nestjs/common";
import { FileController } from "./api/file.controller";
import { FileService } from "./file.service";
import { FileStorageRepository } from "./file-storage/file-storage.repository";
import { S3FileRepository } from "./file-storage/impl/s3-file.repository";
import { FileMetadataRepository } from "./file-metadata/file-metadata.repository";
import { MongoFileMetadataRepository } from "./file-metadata/impl/mongo-file-metadata.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileMetadataSchema } from "./file-metadata/file-metadata.schema";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mongodb",
      host: process.env.MONGO_HOST,
      port: Number.parseInt(process.env.MONGO_PORT),
      database: process.env.MONGO_DB_NAME,
      username: process.env.MONGO_USERNAME,
      password: process.env.MONGO_PASSWORD,
      autoLoadEntities: true
    }),
    TypeOrmModule.forFeature([
      FileMetadataSchema
    ])
  ],
  controllers: [FileController],
  providers: [
    FileService,
    { provide: FileStorageRepository, useClass: S3FileRepository },
    { provide: FileMetadataRepository, useClass: MongoFileMetadataRepository }

  ]
})
export class FileModule {
}
