import {Entity, Column, ObjectId, ObjectIdColumn} from 'typeorm';

@Entity()
export class FileMetadataSchema {
    @ObjectIdColumn()
    _id: ObjectId;
    @Column() name: string;
    @Column() folder: string;
    @Column() size: number;
    @Column() mimeType: string;
    @Column() createdAt: Date;
    @Column() hash: string;
}