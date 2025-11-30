package com.cinepulse.app;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.content.FileProvider;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

public class InstallPermissionModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public InstallPermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "InstallPermissionModule";
    }

    @ReactMethod
    public void openInstallPermissionSettings(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                // For Android 8.0+, open the app-specific "Install unknown apps" settings
                Intent intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                intent.setData(Uri.parse("package:" + reactContext.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
                promise.resolve(true);
            } else {
                // For older versions, open security settings
                Intent intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                reactContext.startActivity(intent);
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to open settings: " + e.getMessage());
        }
    }

    @ReactMethod
    public void canRequestPackageInstalls(Promise promise) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                boolean canInstall = reactContext.getPackageManager().canRequestPackageInstalls();
                promise.resolve(canInstall);
            } else {
                // For older versions, always return true
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to check install permission: " + e.getMessage());
        }
    }

    @ReactMethod
    public void installAPK(String filePath, Promise promise) {
        try {
            File file = new File(filePath);
            if (!file.exists()) {
                promise.reject("ERROR", "APK file not found: " + filePath);
                return;
            }

            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

            Uri apkUri;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                // For Android 7.0+, use FileProvider
                apkUri = FileProvider.getUriForFile(
                    reactContext,
                    reactContext.getPackageName() + ".fileprovider",
                    file
                );
            } else {
                // For older versions, use file:// URI
                apkUri = Uri.fromFile(file);
            }

            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERROR", "Failed to install APK: " + e.getMessage());
        }
    }
}
