import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { selectionAsync } from '../utils/haptics';

interface CustomHeaderProps {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
    variant?: 'default' | 'main';
}

export default function CustomHeader({ title, showBack = true, onBack, rightAction, variant = 'default' }: CustomHeaderProps) {
    const navigation = useNavigation();

    const handleBack = () => {
        selectionAsync();
        if (onBack) {
            onBack();
        } else {
            navigation.goBack();
        }
    };

    if (variant === 'main') {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <View style={styles.profileContainer}>
                            <View style={styles.avatar}>
                                <Text style={{ fontSize: 20 }}>👶</Text>
                            </View>
                            <View>
                                <Text style={styles.profileName}>Agastya</Text>
                                <Text style={styles.profileAge}>1y 7m 2d</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.centerContainer}>
                        <Text style={styles.logoText}>Coddle</Text>
                    </View>

                    <View style={styles.rightContainer}>
                        <TouchableOpacity style={styles.iconButton} onPress={selectionAsync}>
                            <Text style={{ fontSize: 24 }}>🔔</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

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
        paddingHorizontal: 16,
        backgroundColor: colors.background,
    },
    leftContainer: {
        flex: 1,
        alignItems: 'flex-start',
    },
    centerContainer: {
        flex: 1,
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
        borderRadius: 20,
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
    // Main Variant Styles
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF5E1', // Light yellow/cream
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    profileName: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        lineHeight: 18,
    },
    profileAge: {
        fontSize: 11,
        color: colors.textSecondary,
        lineHeight: 14,
    },
    logoText: {
        fontFamily: Platform.OS === 'ios' ? 'Serif' : 'serif',
        fontSize: 24,
        color: '#2A2A5B', // Dark Navy like in screenshot
        fontWeight: '500',
    },
    iconButton: {
        padding: 4,
    }
});
