import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Download, AlertCircle, Settings } from 'lucide-react-native';
import { UpdateService, UpdateState, UpdateInfo } from '@/services/UpdateService';

interface UpdateModalProps {
  visible: boolean;
  updateInfo: UpdateInfo;
  onClose?: () => void;
}

/**
 * Forced update modal - blocks app usage until update is installed
 */
export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  updateInfo,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isWaitingPermission, setIsWaitingPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Disable back button when modal is visible (forced update)
    if (visible && updateInfo.forceUpdate) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        return true; // Prevent back button
      });

      return () => backHandler.remove();
    }
  }, [visible, updateInfo.forceUpdate]);

  useEffect(() => {
    setIsDownloading(updateInfo.state === UpdateState.DOWNLOADING);
    setIsInstalling(updateInfo.state === UpdateState.INSTALLING);
    setIsWaitingPermission(updateInfo.state === UpdateState.PERMISSION_REQUIRED);
    
    if (updateInfo.state === UpdateState.ERROR) {
      setError(updateInfo.error || 'Unknown error');
    } else if (updateInfo.state === UpdateState.PERMISSION_REQUIRED) {
      // Don't show as error, just show the message
      setError(null);
    } else {
      setError(null);
    }
  }, [updateInfo]);

  const handleDownload = async () => {
    setError(null);
    await UpdateService.downloadAndInstall();
  };

  const handleOpenSettings = async () => {
    await UpdateService.openInstallSettings();
  };

  const handleRetry = async () => {
    setError(null);
    await UpdateService.retryInstall();
  };

  const downloadProgress = updateInfo.downloadProgress?.progress || 0;
  const isForced = updateInfo.forceUpdate;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {
        // Only allow close if not forced
        if (!isForced && onClose) {
          onClose();
        }
      }}
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.8)"
        barStyle="light-content"
        translucent
      />
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden border border-zinc-800">
          {/* Header */}
          <View className="bg-gradient-to-br from-blue-600 to-purple-600 p-6">
            <View className="flex-row items-center gap-3">
              <View className="bg-white/20 p-3 rounded-full">
                <Download size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">
                  {isForced ? 'Update Required' : 'Update Available'}
                </Text>
                <Text className="text-white/80 text-sm mt-1">
                  Version {updateInfo.remoteVersion}
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <ScrollView className="max-h-96">
            <View className="p-6">
              {/* Release Notes */}
              {updateInfo.releaseNotes && (
                <View className="mb-6">
                  <Text className="text-zinc-400 text-sm font-semibold mb-2">
                    What's New
                  </Text>
                  <Text className="text-zinc-300 text-sm leading-6">
                    {updateInfo.releaseNotes}
                  </Text>
                </View>
              )}

              {/* ABI Info */}
              {updateInfo.abiInfo && (
                <View className="mb-6">
                  <Text className="text-zinc-500 text-xs">
                    Device ABI: {updateInfo.abiInfo.abi}
                  </Text>
                </View>
              )}


              {/* Download Progress */}
              {isDownloading && (
                <View className="mb-6">
                  <View className="flex-row justify-between mb-3">
                    <Text className="text-emerald-400 text-base font-semibold">Downloading...</Text>
                    <Text className="text-emerald-400 text-base font-bold">{downloadProgress}%</Text>
                  </View>
                  <View className="h-3 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                    <View
                      className="h-full"
                      style={{ 
                        width: `${downloadProgress}%`,
                        backgroundColor: '#10b981' // emerald-500
                      }}
                    />
                  </View>
                  <Text className="text-zinc-500 text-xs mt-2">
                    Please wait while the update is being downloaded...
                  </Text>
                </View>
              )}

              {/* Permission Waiting State */}
              {isWaitingPermission && (
                <View className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <View className="flex-row items-start gap-3">
                    <Settings size={20} color="#f59e0b" />
                    <View className="flex-1">
                      <Text className="text-amber-400 text-sm font-semibold mb-1">
                        Permission Required
                      </Text>
                      <Text className="text-amber-300 text-xs leading-5">
                        {updateInfo.error || 'Please enable "Allow from this source" in settings, then return to this app.'}
                      </Text>
                      <Text className="text-amber-400 text-xs mt-2 font-medium">
                        ⏳ Waiting for you to enable the permission...
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Installing State */}
              {isInstalling && (
                <View className="mb-6 flex-row items-center gap-3">
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text className="text-zinc-400 text-sm">Installing update...</Text>
                </View>
              )}

              {/* Error State */}
              {error && (
                <View className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <View className="flex-row items-start gap-3">
                    <AlertCircle size={20} color="#ef4444" />
                    <View className="flex-1">
                      <Text className="text-red-400 text-sm font-semibold mb-1">
                        Update Failed
                      </Text>
                      <Text className="text-red-300 text-xs leading-5">{error}</Text>
                    </View>
                  </View>

                  {/* Permission Help */}
                  {error.includes('permission') && (
                    <TouchableOpacity
                      onPress={handleOpenSettings}
                      className="mt-4 bg-red-500/20 rounded-lg p-3 flex-row items-center justify-center gap-2"
                    >
                      <Settings size={16} color="#ef4444" />
                      <Text className="text-red-400 text-sm font-semibold">
                        Open Settings
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Forced Update Warning */}
              {isForced && (
                <View className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                  <Text className="text-amber-400 text-xs leading-5">
                    This update is required to continue using the app. You cannot skip this update.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="p-6 pt-0">
            {error ? (
              <TouchableOpacity
                onPress={handleRetry}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 flex-row items-center justify-center gap-2"
              >
                <Download size={20} color="white" />
                <Text className="text-white font-bold text-base">Retry Update</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleDownload}
                disabled={isDownloading || isInstalling}
                className={`rounded-xl p-4 flex-row items-center justify-center gap-2 ${
                  isDownloading || isInstalling
                    ? 'bg-zinc-800'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                }`}
              >
                {isDownloading || isInstalling ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Download size={20} color="white" />
                )}
                <Text className="text-white font-bold text-base">
                  {isDownloading
                    ? 'Downloading...'
                    : isInstalling
                    ? 'Installing...'
                    : 'Update Now'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
