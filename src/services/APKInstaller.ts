import { Platform, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import { APKDownloader } from './APKDownloader';

export interface InstallResult {
    success: boolean;
    error?: string;
    needsPermission?: boolean;
}

/**
 * APK installer using native FileProvider
 */
export class APKInstaller {
    /**
     * Check if app has permission to install APKs (Android O+)
     */
    static async hasInstallPermission(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            return false;
        }

        try {
            if (Platform.Version >= 26 && NativeModules.InstallPermissionModule) {
                const canInstall = await NativeModules.InstallPermissionModule.canRequestPackageInstalls();
                return canInstall;
            }
            return true;
        } catch (error) {
            console.error('[APKInstaller] Error checking permission:', error);
            return true; // Optimistically return true
        }
    }

    /**
     * Open app-specific "Install unknown apps" settings page
     * Uses native module to open the exact permission toggle
     */
    static async openInstallSettings(): Promise<void> {
        try {
            if (Platform.OS !== 'android') {
                return;
            }

            if (NativeModules.InstallPermissionModule) {
                // Use native module to open the exact "Install unknown apps" settings
                console.log('[APKInstaller] Opening install permission settings via native module');
                await NativeModules.InstallPermissionModule.openInstallPermissionSettings();
                console.log('[APKInstaller] Settings opened successfully');
            }
        } catch (error) {
            console.error('[APKInstaller] Failed to open settings:', error);
        }
    }

    /**
     * Install APK from file path using native module with FileProvider
     * @param filePath - Absolute path to APK file
     * @param autoOpenSettings - Auto-open settings if permission not granted
     */
    static async install(
        filePath: string,
        autoOpenSettings: boolean = true
    ): Promise<InstallResult> {
        try {
            if (Platform.OS !== 'android') {
                return {
                    success: false,
                    error: 'APK installation is only supported on Android',
                };
            }

            console.log('[APKInstaller] Installing APK:', filePath);

            // Verify file exists
            const fileExists = await RNFS.exists(filePath);
            if (!fileExists) {
                return {
                    success: false,
                    error: 'APK file not found',
                };
            }

            // Get file stats
            const fileInfo = await RNFS.stat(filePath);
            console.log('[APKInstaller] APK file size:', (fileInfo.size / (1024 * 1024)).toFixed(2), 'MB');

            // Check if we have install permission first
            if (Platform.Version >= 26) {
                const hasPermission = await this.hasInstallPermission();
                console.log('[APKInstaller] Has install permission:', hasPermission);

                if (!hasPermission) {
                    if (autoOpenSettings) {
                        console.log('[APKInstaller] No permission, opening settings');
                        await this.openInstallSettings();
                        return {
                            success: false,
                            needsPermission: true,
                            error: 'Please toggle ON "Allow from this source" in the settings page, then tap "Retry Update".',
                        };
                    }

                    return {
                        success: false,
                        needsPermission: true,
                        error: 'Installation permission required',
                    };
                }
            }

            // Use native module to install APK with FileProvider
            if (NativeModules.InstallPermissionModule) {
                try {
                    console.log('[APKInstaller] Installing via native module');
                    await NativeModules.InstallPermissionModule.installAPK(filePath);
                    console.log('[APKInstaller] Installation intent sent successfully');
                    return {
                        success: true,
                    };
                } catch (error) {
                    console.error('[APKInstaller] Native installation failed:', error);
                    const errorMessage = error instanceof Error ? error.message : String(error);

                    // Check if it's a permission issue
                    if (autoOpenSettings && Platform.Version >= 26) {
                        if (errorMessage.toLowerCase().includes('permission') ||
                            errorMessage.toLowerCase().includes('denied')) {
                            await this.openInstallSettings();
                            return {
                                success: false,
                                needsPermission: true,
                                error: 'Please toggle ON "Allow from this source" in the settings page, then tap "Retry Update".',
                            };
                        }
                    }

                    return {
                        success: false,
                        error: `Installation failed: ${errorMessage}`,
                    };
                }
            } else {
                return {
                    success: false,
                    error: 'Native installation module not available',
                };
            }
        } catch (error) {
            console.error('[APKInstaller] Installation error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Installation failed',
            };
        }
    }

    /**
     * Install APK without automatic cleanup
     */
    static async installWithoutCleanup(
        filePath: string,
        autoOpenSettings: boolean = true
    ): Promise<InstallResult> {
        return await this.install(filePath, autoOpenSettings);
    }

    /**
     * Install APK and clean up file afterwards (legacy method)
     * @deprecated Use installWithoutCleanup
     */
    static async installAndCleanup(
        filePath: string,
        autoOpenSettings: boolean = true
    ): Promise<InstallResult> {
        const result = await this.install(filePath, autoOpenSettings);

        // Only clean up on error, not on success
        if (!result.success && !result.needsPermission) {
            setTimeout(async () => {
                await APKDownloader.deleteAPK(filePath);
            }, 2000);
        }

        return result;
    }
}
