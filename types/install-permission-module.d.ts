import 'react-native';

declare module 'react-native' {
    interface NativeModulesStatic {
        InstallPermissionModule: {
            openInstallPermissionSettings(): Promise<boolean>;
            canRequestPackageInstalls(): Promise<boolean>;
            installAPK(filePath: string): Promise<boolean>;
        };
    }
}
