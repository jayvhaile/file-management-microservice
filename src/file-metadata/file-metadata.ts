export interface FileMetadata {
    id: string;
    name: string;
    folder: string;
    size: number;
    mimeType: string;
    createdAt: Date;
    hash: string;
    extension: string;
}