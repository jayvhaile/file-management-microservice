import * as AWS from 'aws-sdk';
import {FileStorageRepository} from "../file-storage.repository";
import {FileData} from "../../models/file-data";

class S3FileRepository extends FileStorageRepository {
    private s3: AWS.S3;

    constructor() {
        super();
        this.s3 = new AWS.S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
            region: process.env.AWS_REGION,
        });
    }

    async upload(data: Buffer, path: string): Promise<void> {
        await this.s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path,
            Body: data,
        }).promise();

    }

    async download(filePath: string): Promise<Buffer> {
        const result = await this.s3.getObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePath,
        }).promise();

        if (result.Body === undefined) throw new Error('File not found');

        return result.Body as Buffer;
    }

    async delete(fileId: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileId,
        }).promise();
    }
}