import { Entity, Column, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class FileMetadataSchema {
  @ObjectIdColumn()
  _id: ObjectId;
  @Column() referenceId: string;
  @Column() name: string;
  @Column() folder: string;
  @Column() size: number;
  @Column() mimeType: string;
  @Column() extension: string;
  @Column() createdAt: Date;
  @Column() hash: string;
}