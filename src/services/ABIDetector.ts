import DeviceInfo from 'react-native-device-info';

export interface ABISelection {
    abi: string;
    url: string;
}

export interface ABIError {
    error: string;
    availableABIs: string[];
    deviceABIs: string[];
}

/**
 * Detects device CPU ABI and selects the appropriate APK download URL
 */
export class ABIDetector {
    /**
     * Get device supported ABIs in order of preference
     */
    static async getDeviceABIs(): Promise<string[]> {
        try {
            const abis = await DeviceInfo.supportedAbis();
            return abis;
        } catch (error) {
            console.error('Failed to get device ABIs:', error);
            return [];
        }
    }

    /**
     * Select the best matching APK URL based on device ABI
     * @param apkUrls - JSON object mapping ABI keys to download URLs
     * @returns ABISelection with matched ABI and URL, or ABIError if no match
     */
    static async selectAPKUrl(
        apkUrls: Record<string, string>
    ): Promise<ABISelection | ABIError> {
        const deviceABIs = await this.getDeviceABIs();
        const availableABIs = Object.keys(apkUrls);

        if (deviceABIs.length === 0) {
            return {
                error: 'Unable to detect device ABI',
                availableABIs,
                deviceABIs: [],
            };
        }

        // Try to find exact ABI match (in order of device preference)
        for (const deviceABI of deviceABIs) {
            if (apkUrls[deviceABI]) {
                console.log(`[ABIDetector] Matched ABI: ${deviceABI}`);
                return {
                    abi: deviceABI,
                    url: apkUrls[deviceABI],
                };
            }
        }

        // Fallback to universal APK if available
        if (apkUrls['universal']) {
            console.log('[ABIDetector] Using universal APK as fallback');
            return {
                abi: 'universal',
                url: apkUrls['universal'],
            };
        }

        // No match found
        return {
            error: `No matching APK found for device ABIs: ${deviceABIs.join(', ')}. Available ABIs: ${availableABIs.join(', ')}`,
            availableABIs,
            deviceABIs,
        };
    }

    /**
     * Check if the selection result is an error
     */
    static isError(
        result: ABISelection | ABIError
    ): result is ABIError {
        return 'error' in result;
    }
}
