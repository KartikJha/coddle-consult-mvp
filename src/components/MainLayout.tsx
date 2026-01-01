import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import CustomHeader from './CustomHeader';
import BottomNav from './BottomNav';
import { colors } from '../theme/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

interface MainLayoutProps {
    children: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
    title?: string;
    variant?: 'default' | 'main';
}

export default function MainLayout({ children, showBack, onBack, title, variant = 'main' }: MainLayoutProps) {
    const navigation = useNavigation();
    const route = useRoute();

    const handleHomePress = () => {
        // Reset to Home/AI Assistant flow if needed
        // For MVP, just navigate to 'Home' which is the AI Assistant view basically
        navigation.navigate('Home' as never);
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <CustomHeader
                    variant={variant}
                    title={title}
                    showBack={showBack}
                    onBack={onBack}
                />

                <View style={styles.content}>
                    {children}
                </View>

                <BottomNav
                    activeTab="AI Assistant"
                    onTabPress={(tab) => {
                        if (tab === 'AI Assistant') {
                            handleHomePress();
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        // Ensure content doesn't get hidden behind bottom nav if we used absolute positioning there
        // But here we are using flex, so it should be fine.
    },
});
