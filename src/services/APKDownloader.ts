import RNFS from 'react-native-fs';

export interface DownloadProgress {
    bytesWritten: number;
    contentLength: number;
    progress: number; // 0-100
}

export interface DownloadResult {
    success: boolean;
    filePath?: string;
    error?: string;
}

/**
 * APK downloader with progress tracking
 */
export class APKDownloader {
    private downloadJobId: number | null = null;
    private onProgressCallback: ((progress: DownloadProgress) => void) | null = null;

    /**
     * Download APK from URL to internal storage
     * @param url - Direct download URL (GitHub release asset)
     * @param filename - Filename for the downloaded APK
     * @param onProgress - Progress callback
     */
    async download(
        url: string,
        filename: string,
        onProgress?: (progress: DownloadProgress) => void
    ): Promise<DownloadResult> {
        this.onProgressCallback = onProgress || null;

        // Use app's internal cache directory (automatically cleaned by system when needed)
        const downloadPath = `${RNFS.CachesDirectoryPath}/${filename}`;

        try {
            console.log('[APKDownloader] Starting download from:', url);
            console.log('[APKDownloader] Download path:', downloadPath);

            // Check if file already exists and delete it
            const fileExists = await RNFS.exists(downloadPath);
            if (fileExists) {
                console.log('[APKDownloader] Removing existing file');
                await RNFS.unlink(downloadPath);
            }

            // Start download
            const downloadResult = RNFS.downloadFile({
                fromUrl: url,
                toFile: downloadPath,
                background: false,
                discretionary: false,
                cacheable: false,
                progressInterval: 500, // Update progress every 500ms
                begin: (res) => {
                    console.log('[APKDownloader] Download started, content length:', res.contentLength);
                },
                progress: (res) => {
                    const progress: DownloadProgress = {
                        bytesWritten: res.bytesWritten,
                        contentLength: res.contentLength,
                        progress: res.contentLength > 0
                            ? Math.round((res.bytesWritten / res.contentLength) * 100)
                            : 0,
                    };

                    if (this.onProgressCallback) {
                        this.onProgressCallback(progress);
                    }
                },
            });

            this.downloadJobId = downloadResult.jobId;
            const result = await downloadResult.promise;

            if (result.statusCode === 200) {
                // Verify file exists and has reasonable size
                const fileInfo = await RNFS.stat(downloadPath);
                const fileSizeMB = fileInfo.size / (1024 * 1024);

                console.log(`[APKDownloader] Download complete, size: ${fileSizeMB.toFixed(2)} MB`);

                // Warn if file is suspiciously small (< 1MB) or large (> 500MB)
                if (fileSizeMB < 1) {
                    console.warn('[APKDownloader] Warning: Downloaded file is very small');
                } else if (fileSizeMB > 500) {
                    console.warn('[APKDownloader] Warning: Downloaded file is very large');
                }

                return {
                    success: true,
                    filePath: downloadPath,
                };
            } else {
                console.error('[APKDownloader] Download failed with status:', result.statusCode);
                return {
                    success: false,
                    error: `Download failed with HTTP status ${result.statusCode}`,
                };
            }
        } catch (error) {
            console.error('[APKDownloader] Download error:', error);

            // Clean up partial download
            try {
                const exists = await RNFS.exists(downloadPath);
                if (exists) {
                    await RNFS.unlink(downloadPath);
                }
            } catch (cleanupError) {
                console.error('[APKDownloader] Cleanup error:', cleanupError);
            }

            return {
                success: false,
                error: error instanceof Error ? error.message : 'Download failed',
            };
        }
    }

    /**
     * Cancel ongoing download
     */
    async cancel(): Promise<void> {
        if (this.downloadJobId !== null) {
            console.log('[APKDownloader] Cancelling download');
            RNFS.stopDownload(this.downloadJobId);
            this.downloadJobId = null;
        }
    }

    /**
     * Delete downloaded APK file
     */
    static async deleteAPK(filePath: string): Promise<void> {
        try {
            const exists = await RNFS.exists(filePath);
            if (exists) {
                await RNFS.unlink(filePath);
                console.log('[APKDownloader] Deleted APK:', filePath);
            }
        } catch (error) {
            console.error('[APKDownloader] Failed to delete APK:', error);
        }
    }
}
