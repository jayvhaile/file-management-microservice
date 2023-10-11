export interface FileData {
    data: Buffer,
    name: string,
    folder: string,
    mimeType: string,
}

export namespace FileData {
    export function fullPath(file: FileData) {
        return `${file.folder}/${file.name}`
    }

    export function from(path: string, data: Buffer) {
        const split = path.split('/')
        return {
            data,
            name: split[split.length - 1],
            folder: split.slice(0, split.length - 1).join('/')
        }
    }
}