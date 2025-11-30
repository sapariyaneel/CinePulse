declare module 'react-native-fs' {
    export interface DownloadFileOptions {
        fromUrl: string;
        toFile: string;
        headers?: { [key: string]: string };
        background?: boolean;
        discretionary?: boolean;
        cacheable?: boolean;
        progressInterval?: number;
        progressDivider?: number;
        begin?: (res: DownloadBeginCallbackResult) => void;
        progress?: (res: DownloadProgressCallbackResult) => void;
        resumable?: () => void;
        connectionTimeout?: number;
        readTimeout?: number;
        backgroundTimeout?: number;
    }

    export interface DownloadBeginCallbackResult {
        jobId: number;
        statusCode: number;
        contentLength: number;
        headers: { [key: string]: string };
    }

    export interface DownloadProgressCallbackResult {
        jobId: number;
        contentLength: number;
        bytesWritten: number;
    }

    export interface DownloadResult {
        jobId: number;
        statusCode: number;
        bytesWritten: number;
    }

    export interface DownloadFileReturn {
        jobId: number;
        promise: Promise<DownloadResult>;
    }

    export interface StatResult {
        path: string;
        ctime: Date;
        mtime: Date;
        size: number;
        mode: number;
        originalFilepath: string;
        isFile: () => boolean;
        isDirectory: () => boolean;
    }

    export const CachesDirectoryPath: string;
    export const DocumentDirectoryPath: string;
    export const DownloadDirectoryPath: string;
    export const ExternalDirectoryPath: string;
    export const ExternalStorageDirectoryPath: string;
    export const TemporaryDirectoryPath: string;
    export const LibraryDirectoryPath: string;
    export const PicturesDirectoryPath: string;

    export function downloadFile(options: DownloadFileOptions): DownloadFileReturn;
    export function stopDownload(jobId: number): void;
    export function exists(filepath: string): Promise<boolean>;
    export function unlink(filepath: string): Promise<void>;
    export function stat(filepath: string): Promise<StatResult>;
    export function readDir(dirpath: string): Promise<any[]>;
    export function mkdir(filepath: string, options?: any): Promise<void>;
    export function moveFile(filepath: string, destPath: string): Promise<void>;
    export function copyFile(filepath: string, destPath: string): Promise<void>;
    export function readFile(filepath: string, encoding?: string): Promise<string>;
    export function writeFile(filepath: string, contents: string, encoding?: string): Promise<void>;
}
