declare module 'react-native-send-intent' {
    export interface SendIntentAndroid {
        openChromeIntent(url: string): void;
        openDownloadManager(): void;
        openSettings(settingsName: string): void;
        openApp(packageName: string, extras?: any): Promise<void>;
        openAppWithData(packageName: string, data: string): Promise<void>;
        installRemoteApp(uri: string, type: string): Promise<void>;
        openFileChooser(options: any, title: string): Promise<void>;
        openCamera(): void;
        openEmailApp(): void;
        openSMSApp(phoneNumber?: string, message?: string): void;
        openPhoneApp(phoneNumber?: string, showDialer?: boolean): void;
        openMaps(address: string): void;
        openCalendar(): void;
        sendText(options: any): void;
        sendMail(options: any): void;
        sendSms(phoneNumber: string, message: string): void;
        addCalendarEvent(options: any): void;
        isAppInstalled(packageName: string): Promise<boolean>;
        openAppWithUri(uri: string): Promise<void>;
    }

    const SendIntentAndroid: SendIntentAndroid;
    export default SendIntentAndroid;
}
