import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Download, AlertCircle, Settings, X, Clock } from 'lucide-react-native';
import { UpdateService, UpdateState, UpdateInfo } from '@/services/UpdateService';

interface OptionalUpdateModalProps {
  visible: boolean;
  updateInfo: UpdateInfo;
  onClose: () => void;
  onRemindLater: () => void;
}

/**
 * Optional update modal - dismissible with "Remind Me Later" option
 */
export const OptionalUpdateModal: React.FC<OptionalUpdateModalProps> = ({
  visible,
  updateInfo,
  onClose,
  onRemindLater,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isWaitingPermission, setIsWaitingPermission] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleRemindLater = async () => {
    if (updateInfo.remoteVersion) {
      await UpdateService.setRemindLater(updateInfo.remoteVersion);
      onRemindLater();
    }
  };

  const downloadProgress = updateInfo.downloadProgress?.progress || 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.8)"
        barStyle="light-content"
        translucent
      />
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-zinc-900 rounded-3xl w-full max-w-md overflow-hidden border border-zinc-800">
          {/* Header */}
          <View className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6">
            <View className="flex-row items-center gap-3">
              <View className="bg-white/20 p-3 rounded-full">
                <Download size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-xl font-bold">Update Available</Text>
                <Text className="text-white/80 text-sm mt-1">
                  Version {updateInfo.remoteVersion}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="bg-white/20 p-2 rounded-full"
              >
                <X size={20} color="white" />
              </TouchableOpacity>
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

              {/* Installing State */}
              {isInstalling && (
                <View className="mb-6 flex-row items-center gap-3">
                  <ActivityIndicator size="small" color="#10b981" />
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
            </View>
          </ScrollView>

          {/* Actions */}
          <View className="p-6 pt-0 gap-3">
            {error ? (
              <TouchableOpacity
                onPress={handleRetry}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 flex-row items-center justify-center gap-2"
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
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600'
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

            {!isDownloading && !isInstalling && (
              <TouchableOpacity
                onPress={handleRemindLater}
                className="bg-zinc-800 rounded-xl p-4 flex-row items-center justify-center gap-2"
              >
                <Clock size={20} color="#a1a1aa" />
                <Text className="text-zinc-400 font-semibold text-base">
                  Remind Me Later
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
