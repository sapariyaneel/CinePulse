import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import BootSplash from 'react-native-bootsplash';
import { UpdateService, UpdateState, UpdateInfo } from '@/services/UpdateService';
import { UpdateModal } from '@/components/UpdateModal';
import { OptionalUpdateModal } from '@/components/OptionalUpdateModal';
import './global.css';

const App = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showOptionalModal, setShowOptionalModal] = useState(false);

  useEffect(() => {
    // Hide splash screen after app is ready
    const init = async () => {
      // Set up update callback
      UpdateService.setCallback((info) => {
        setUpdateInfo(info);

        // Show appropriate modal based on update type
        if (info.state === UpdateState.AVAILABLE) {
          if (info.forceUpdate) {
            setShowUpdateModal(true);
            setShowOptionalModal(false);
          } else {
            setShowOptionalModal(true);
            setShowUpdateModal(false);
          }
        }
      });

      // Check for updates
      await UpdateService.checkForUpdates();
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
    });
  }, []);

  const handleOptionalModalClose = () => {
    setShowOptionalModal(false);
  };

  const handleRemindLater = () => {
    setShowOptionalModal(false);
  };

  // Block app navigation if forced update is required
  const isBlocked = updateInfo?.forceUpdate && updateInfo?.state === UpdateState.AVAILABLE;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!isBlocked && <RootNavigator />}
      </NavigationContainer>

      {/* Forced Update Modal */}
      {updateInfo && (
        <UpdateModal
          visible={showUpdateModal}
          updateInfo={updateInfo}
        />
      )}

      {/* Optional Update Modal */}
      {updateInfo && (
        <OptionalUpdateModal
          visible={showOptionalModal}
          updateInfo={updateInfo}
          onClose={handleOptionalModalClose}
          onRemindLater={handleRemindLater}
        />
      )}
    </SafeAreaProvider>
  );
};

export default App;