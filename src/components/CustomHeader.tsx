import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, theme } from '../theme/colors';
import * as Haptics from 'expo-haptics';
import { selectionAsync } from '../utils/haptics';

interface CustomHeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export default function CustomHeader({ title, showBack = true, onBack, rightAction }: CustomHeaderProps) {
    const navigation = useNavigation();

    const handleBack = () => {
        selectionAsync();
        if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    {showBack && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.centerContainer}>
                    {title && <Text style={styles.title}>{title}</Text>}
                </View>

                <View style={styles.rightContainer}>
                    {rightAction}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: colors.background,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 2,
        alignItems: 'center',
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    backButton: {
        backgroundColor: colors.white,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20, // Pill shape
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
    },
});
