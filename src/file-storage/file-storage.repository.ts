export abstract class FileStorageRepository {
    abstract upload(data: Buffer, path: string): Promise<void>;  // assuming upload returns a file ID

    abstract download(path: string): Promise<Buffer>;

    abstract getDownloadUrl(path: string): Promise<string>;

    abstract delete(path: string): Promise<void>;
}


