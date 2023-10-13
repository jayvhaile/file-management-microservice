export interface FileMetadata {
  id: string;
  referenceId: string;
  name: string;
  folder: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  hash: string;
  extension: string;
}


export namespace FileMetadata{

  export function toPath(metadata: FileMetadata) {
    return `${metadata.folder}/${metadata.id}.${metadata.extension}`
  }
}