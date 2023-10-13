import { FileStorageRepository } from "../file-storage.repository";
import { Injectable } from "@nestjs/common";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";


const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
@Injectable()
export class S3FileRepository extends FileStorageRepository {
  private s3Client: S3Client;

  constructor() {
    super();
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      region: process.env.AWS_REGION
    });
  }

  async upload(data: Buffer, path: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: data
    });
    await this.s3Client.send(command);

  }

  async download(filePath: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath
    });
    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new Error("No file body");
    }

    const byteArray = await response.Body.transformToByteArray();

    return Buffer.from(byteArray);
  }

  async getDownloadUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });


      // URL expires in 1 hour
    return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
  }

  async delete(filePath: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath
    });
    await this.s3Client.send(command);
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath
      });
      await this.s3Client.send(command);
      return true;
    } catch (e) {
      return false;
    }
  }
}