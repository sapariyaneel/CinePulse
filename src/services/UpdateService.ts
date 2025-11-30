import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import semver from 'semver';
import RNFS from 'react-native-fs';
import { AppState, AppStateStatus } from 'react-native';
import { SupabaseUpdateClient, AppRelease } from './SupabaseUpdateClient';
import { ABIDetector, ABISelection, ABIError } from './ABIDetector';
import { APKDownloader, DownloadProgress } from './APKDownloader';
import { APKInstaller } from './APKInstaller';
import { FORCE_UPDATE_GLOBAL, AUTO_PROMPT_INSTALL_PERMISSION } from '@env';

const REMIND_LATER_KEY = '@update_remind_later';
const REMIND_LATER_VERSION_KEY = '@update_remind_later_version';

export enum UpdateState {
    IDLE = 'idle',
    CHECKING = 'checking',
    AVAILABLE = 'available',
    PERMISSION_REQUIRED = 'permission_required',
    DOWNLOADING = 'downloading',
    INSTALLING = 'installing',
    ERROR = 'error',
    UP_TO_DATE = 'up_to_date',
}

export interface UpdateInfo {
    state: UpdateState;
    currentVersion: string;
    remoteVersion?: string;
    forceUpdate?: boolean;
    releaseNotes?: string;
    downloadProgress?: DownloadProgress;
    error?: string;
    abiInfo?: ABISelection;
}

export type UpdateCallback = (info: UpdateInfo) => void;

/**
 * Main update service orchestrating the entire update flow
 */
export class UpdateService {
    private static callback: UpdateCallback | null = null;
    private static currentInfo: UpdateInfo = {
        state: UpdateState.IDLE,
        currentVersion: '',
    };
    private static downloader: APKDownloader | null = null;
    private static downloadedFilePath: string | null = null;
    private static appStateSubscription: any = null;
    private static waitingForPermission: boolean = false;

    /**
     * Set callback for update state changes
     */
    static setCallback(callback: UpdateCallback): void {
        this.callback = callback;
    }

    /**
     * Emit update info to callback
     */
    private static emit(info: Partial<UpdateInfo>): void {
        this.currentInfo = { ...this.currentInfo, ...info };
        if (this.callback) {
            this.callback(this.currentInfo);
        }
    }

    /**
     * Setup AppState listener to detect when user returns from settings
     */
    private static setupAppStateListener(): void {
        if (this.appStateSubscription) {
            return; // Already listening
        }

        this.appStateSubscription = AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && this.waitingForPermission) {
                console.log('[UpdateService] App became active, checking permission');

                // Check if permission is now granted
                const hasPermission = await APKInstaller.hasInstallPermission();
                console.log('[UpdateService] Permission status after returning:', hasPermission);

                if (hasPermission) {
                    // Permission granted! Continue with download
                    this.waitingForPermission = false;
                    console.log('[UpdateService] Permission granted, continuing download');
                    await this.continueDownload();
                }
            }
        });
    }

    /**
     * Remove AppState listener
     */
    private static removeAppStateListener(): void {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
    }

    /**
     * Continue download after permission is granted
     */
    private static async continueDownload(): Promise<void> {
        if (!this.currentInfo.abiInfo || !this.currentInfo.remoteVersion) {
            return;
        }

        // Check if file already exists
        if (this.downloadedFilePath) {
            try {
                const fileExists = await RNFS.exists(this.downloadedFilePath);
                if (fileExists) {
                    console.log('[UpdateService] APK already downloaded, proceeding to install');
                    await this.installAPK(this.downloadedFilePath);
                    return;
                } else {
                    this.downloadedFilePath = null;
                }
            } catch (error) {
                console.error('[UpdateService] Error checking existing file:', error);
                this.downloadedFilePath = null;
            }
        }

        this.emit({ state: UpdateState.DOWNLOADING, downloadProgress: { bytesWritten: 0, contentLength: 0, progress: 0 } });

        try {
            // Download APK
            const filename = `cinepulse-${this.currentInfo.remoteVersion}-${this.currentInfo.abiInfo.abi}.apk`;
            this.downloader = new APKDownloader();

            const downloadResult = await this.downloader.download(
                this.currentInfo.abiInfo.url,
                filename,
                (progress) => {
                    this.emit({
                        state: UpdateState.DOWNLOADING,
                        downloadProgress: progress
                    });
                }
            );

            if (!downloadResult.success || !downloadResult.filePath) {
                this.emit({
                    state: UpdateState.ERROR,
                    error: downloadResult.error || 'Download failed',
                });
                return;
            }

            this.downloadedFilePath = downloadResult.filePath;
            console.log('[UpdateService] Download complete:', this.downloadedFilePath);

            // Install APK
            await this.installAPK(downloadResult.filePath);
        } catch (error) {
            console.error('[UpdateService] Download error:', error);
            this.emit({
                state: UpdateState.ERROR,
                error: error instanceof Error ? error.message : 'Unknown error',
            });

            // Clean up downloaded file on error
            if (this.downloadedFilePath) {
                await APKDownloader.deleteAPK(this.downloadedFilePath);
                this.downloadedFilePath = null;
            }
        }
    }

    /**
     * Get current installed app version
     */
    static async getCurrentVersion(): Promise<string> {
        try {
            const version = DeviceInfo.getVersion();
            return version;
        } catch (error) {
            console.error('[UpdateService] Failed to get current version:', error);
            return '0.0.0';
        }
    }

    /**
     * Check if remote version is greater than installed version
     */
    static isUpdateAvailable(currentVersion: string, remoteVersion: string): boolean {
        try {
            // Clean versions (remove any 'v' prefix)
            const cleanCurrent = currentVersion.replace(/^v/, '');
            const cleanRemote = remoteVersion.replace(/^v/, '');

            return semver.gt(cleanRemote, cleanCurrent);
        } catch (error) {
            console.error('[UpdateService] Version comparison error:', error);
            return false;
        }
    }

    /**
     * Check if user has chosen "Remind Me Later" for this version
     */
    static async hasRemindedLater(version: string): Promise<boolean> {
        try {
            const remindedVersion = await AsyncStorage.getItem(REMIND_LATER_VERSION_KEY);
            return remindedVersion === version;
        } catch (error) {
            console.error('[UpdateService] Failed to check remind later:', error);
            return false;
        }
    }

    /**
     * Set "Remind Me Later" for a version
     */
    static async setRemindLater(version: string): Promise<void> {
        try {
            await AsyncStorage.setItem(REMIND_LATER_VERSION_KEY, version);
            await AsyncStorage.setItem(REMIND_LATER_KEY, new Date().toISOString());
            console.log('[UpdateService] Remind later set for version:', version);
        } catch (error) {
            console.error('[UpdateService] Failed to set remind later:', error);
        }
    }

    /**
     * Clear "Remind Me Later" preference
     */
    static async clearRemindLater(): Promise<void> {
        try {
            await AsyncStorage.removeItem(REMIND_LATER_VERSION_KEY);
            await AsyncStorage.removeItem(REMIND_LATER_KEY);
        } catch (error) {
            console.error('[UpdateService] Failed to clear remind later:', error);
        }
    }

    /**
     * Check for updates
     */
    static async checkForUpdates(): Promise<UpdateInfo> {
        this.emit({ state: UpdateState.CHECKING });

        try {
            // Get current version
            const currentVersion = await this.getCurrentVersion();
            this.emit({ currentVersion });

            // Fetch latest release from Supabase
            const { release, error } = await SupabaseUpdateClient.fetchLatestRelease();

            if (error || !release) {
                this.emit({
                    state: UpdateState.ERROR,
                    error: error || 'No releases found',
                });
                return this.currentInfo;
            }

            // Check if update is available
            const updateAvailable = this.isUpdateAvailable(currentVersion, release.version);

            if (!updateAvailable) {
                this.emit({ state: UpdateState.UP_TO_DATE });
                return this.currentInfo;
            }

            // Check force update (global override or release flag)
            const forceUpdateGlobal = FORCE_UPDATE_GLOBAL === 'true';
            const forceUpdate = forceUpdateGlobal || release.force_update;

            // Note: Removed "Remind Me Later" persistence check
            // Optional updates will always show on app restart
            // "Remind Me Later" only dismisses the modal for the current session

            // Select appropriate ABI
            const abiResult = await ABIDetector.selectAPKUrl(release.apk_urls);

            if (ABIDetector.isError(abiResult)) {
                this.emit({
                    state: UpdateState.ERROR,
                    error: abiResult.error,
                });
                return this.currentInfo;
            }

            this.emit({
                state: UpdateState.AVAILABLE,
                remoteVersion: release.version,
                forceUpdate,
                releaseNotes: release.release_notes || undefined,
                abiInfo: abiResult,
            });

            return this.currentInfo;
        } catch (error) {
            console.error('[UpdateService] Check for updates error:', error);
            this.emit({
                state: UpdateState.ERROR,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            return this.currentInfo;
        }
    }

    /**
     * Download and install update
     * Checks permission first before downloading
     */
    static async downloadAndInstall(): Promise<void> {
        if (!this.currentInfo.abiInfo || !this.currentInfo.remoteVersion) {
            this.emit({
                state: UpdateState.ERROR,
                error: 'No update available to download',
            });
            return;
        }

        // Check permission first before downloading
        const hasPermission = await APKInstaller.hasInstallPermission();
        console.log('[UpdateService] Has install permission:', hasPermission);

        if (!hasPermission) {
            console.log('[UpdateService] Permission required, opening settings');
            this.emit({
                state: UpdateState.PERMISSION_REQUIRED,
                error: 'Please enable "Allow from this source" in the settings that will open, then return to this app.'
            });

            // Setup listener to detect when user returns
            this.setupAppStateListener();
            this.waitingForPermission = true;

            const autoPrompt = AUTO_PROMPT_INSTALL_PERMISSION !== 'false';
            if (autoPrompt) {
                // Small delay to ensure state is updated before opening settings
                setTimeout(async () => {
                    await APKInstaller.openInstallSettings();
                }, 500);
            }

            return;
        }

        // Permission granted, continue with download
        await this.continueDownload();
    }

    /**
     * Install APK file
     */
    private static async installAPK(filePath: string): Promise<void> {
        this.emit({ state: UpdateState.INSTALLING });

        const autoPrompt = AUTO_PROMPT_INSTALL_PERMISSION !== 'false';
        const installResult = await APKInstaller.installWithoutCleanup(
            filePath,
            autoPrompt
        );

        if (!installResult.success) {
            if (installResult.needsPermission) {
                this.emit({
                    state: UpdateState.ERROR,
                    error: installResult.error || 'Installation permission required',
                });
            } else {
                this.emit({
                    state: UpdateState.ERROR,
                    error: installResult.error || 'Installation failed',
                });

                // Clean up on installation error
                await APKDownloader.deleteAPK(filePath);
                this.downloadedFilePath = null;
            }
            return;
        }

        // Clear remind later preference after successful installation
        await this.clearRemindLater();

        // Remove app state listener
        this.removeAppStateListener();
        this.waitingForPermission = false;

        console.log('[UpdateService] Update installation started successfully');
        // Note: App will likely be closed by the installer at this point
    }

    /**
     * Cancel ongoing download
     */
    static async cancelDownload(): Promise<void> {
        if (this.downloader) {
            await this.downloader.cancel();
            this.downloader = null;
        }

        // Clean up downloaded file
        if (this.downloadedFilePath) {
            await APKDownloader.deleteAPK(this.downloadedFilePath);
            this.downloadedFilePath = null;
        }

        // Remove app state listener
        this.removeAppStateListener();
        this.waitingForPermission = false;

        this.emit({ state: UpdateState.IDLE });
    }

    /**
     * Retry installation (if permission was granted or file exists)
     */
    static async retryInstall(): Promise<void> {
        // Check if file exists
        if (this.downloadedFilePath) {
            try {
                const fileExists = await RNFS.exists(this.downloadedFilePath);
                if (fileExists) {
                    console.log('[UpdateService] Retrying installation with existing file');
                    await this.installAPK(this.downloadedFilePath);
                    return;
                } else {
                    // File doesn't exist, clear path and download fresh
                    console.log('[UpdateService] Downloaded file not found, starting fresh download');
                    this.downloadedFilePath = null;
                }
            } catch (error) {
                console.error('[UpdateService] Error checking file:', error);
                this.downloadedFilePath = null;
            }
        }

        // No file exists, start fresh download (which will check permission)
        await this.downloadAndInstall();
    }

    /**
     * Open install permission settings
     */
    static async openInstallSettings(): Promise<void> {
        try {
            await APKInstaller.openInstallSettings();
        } catch (error) {
            console.error('[UpdateService] Failed to open settings:', error);
        }
    }

    /**
     * Get current update info
     */
    static getCurrentInfo(): UpdateInfo {
        return this.currentInfo;
    }

    /**
     * Clean up downloaded APK file manually
     */
    static async cleanupDownloadedAPK(): Promise<void> {
        if (this.downloadedFilePath) {
            await APKDownloader.deleteAPK(this.downloadedFilePath);
            this.downloadedFilePath = null;
            console.log('[UpdateService] Cleaned up downloaded APK');
        }
    }
}
