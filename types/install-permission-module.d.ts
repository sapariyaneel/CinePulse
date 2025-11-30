declare module 'react-native' {
    export interface NativeModulesStatic {
        InstallPermissionModule: {
            openInstallPermissionSettings(): Promise<boolean>;
            canRequestPackageInstalls(): Promise<boolean>;
            installAPK(filePath: string): Promise<boolean>;
        };
    }
}
