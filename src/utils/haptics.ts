import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Helper to prevent crashes if Haptics isn't available (web or some simulators)
const isHapticsAvailable = Platform.OS !== 'web'; // Basic web check, real check is if the module loads

export const impactAsync = async (style: Haptics.ImpactFeedbackStyle) => {
    if (isHapticsAvailable) {
        try {
            await Haptics.impactAsync(style);
        } catch (e) {
            console.warn('Haptics not available', e);
        }
    }
};

export const selectionAsync = async () => {
    if (isHapticsAvailable) {
        try {
            await Haptics.selectionAsync();
        } catch (e) {
            console.warn('Haptics not available', e);
        }
    }
}

export const notificationAsync = async (type: Haptics.NotificationFeedbackType) => {
    if (isHapticsAvailable) {
        try {
            await Haptics.notificationAsync(type);
        } catch (e) {
            console.warn('Haptics not available', e);
        }
    }
}
