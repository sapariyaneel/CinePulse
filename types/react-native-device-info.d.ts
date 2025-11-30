declare module 'react-native-device-info' {
    export function getVersion(): string;
    export function getBuildNumber(): string;
    export function getApplicationName(): string;
    export function getBundleId(): string;
    export function supportedAbis(): Promise<string[]>;
    export function getSystemVersion(): string;
    export function getModel(): string;
    export function getBrand(): string;
    export function getDeviceId(): string;
    export function isEmulator(): Promise<boolean>;
    export function isTablet(): boolean;
    export function getUniqueId(): Promise<string>;
    export function getManufacturer(): Promise<string>;
    export function getDeviceName(): Promise<string>;

    export default {
        getVersion,
        getBuildNumber,
        getApplicationName,
        getBundleId,
        supportedAbis,
        getSystemVersion,
        getModel,
        getBrand,
        getDeviceId,
        isEmulator,
        isTablet,
        getUniqueId,
        getManufacturer,
        getDeviceName,
    };
}
