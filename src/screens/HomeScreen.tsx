import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';
import { selectionAsync, impactAsync } from '../utils/haptics';
import * as Haptics from 'expo-haptics';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleConsultPress = () => {
        impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        navigation.navigate('Concern');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Insight Card */}
                <View style={styles.insightCard}>
                    <View style={styles.insightHeader}>
                        <Text style={styles.bulbIcon}>💡</Text>
                        <Text style={styles.insightTitle}>Insight of the day</Text>
                    </View>
                    <Text style={styles.insightText}>
                        Parenting is a journey—every stage brings new joys and challenges.
                        Remember to take care of yourself along the way.
                    </Text>
                </View>

                {/* Spacer to push content down roughly as per screenshot */}
                <View style={{ height: 100 }} />

                {/* See Previous Messages Button */}
                <TouchableOpacity style={styles.previousMessagesButton} onPress={selectionAsync} activeOpacity={0.7}>
                    <Text style={styles.previousMessagesText}>See previous messages</Text>
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                {/* Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer} contentContainerStyle={styles.chipsContent}>
                    <TouchableOpacity style={[styles.chip, { backgroundColor: '#FFE8D1' }]} activeOpacity={0.8}>
                        <Text style={styles.chipText}>Daily routine tips?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.chip, { backgroundColor: '#E6E6FA' }]} activeOpacity={0.8}>
                        <Text style={styles.chipText}>Development questions?</Text>
                    </TouchableOpacity>
                </ScrollView>

                {/* Fake Input */}
                <View style={styles.fakeInputContainer}>
                    <Text style={styles.fakeInputText}>Ask me anything or log baby's day...</Text>
                    <View style={styles.sendIcon}>
                        <Text style={{ color: 'white', fontSize: 16 }}>➤</Text>
                    </View>
                </View>

                {/* Disclaimer */}
                <Text style={styles.disclaimer}>
                    Coddle's smart, but not perfect. Always consult with your doctor.
                </Text>
            </ScrollView>

            {/* Floating Chat Bubble */}
            <TouchableOpacity
                style={styles.fab}
                onPress={handleConsultPress}
                activeOpacity={0.8}
            >
                <Text style={styles.fabIcon}>💬</Text>
            </TouchableOpacity>

            {/* Bottom Navigation (Static) */}
            <View style={styles.bottomNav}>
                <NavItem icon="🏠" label="Home" active />
                <NavItem icon="🤖" label="AI Assistant" />
                <NavItem icon="📅" label="History" />
                <NavItem icon="📊" label="Insights" />
                <NavItem icon="⚙️" label="Settings" />
                <NavItem icon="👶" label="Child" />
            </View>
        </SafeAreaView>
    );
}

const NavItem = ({ icon, label, active = false }: { icon: string, label: string, active?: boolean }) => (
    <View style={styles.navItem}>
        <View style={[styles.navIconContainer, active && styles.navIconActive]}>
            <Text style={[styles.navIcon, active && { color: 'white' }]}>{icon}</Text>
        </View>
        <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 100, // Space for Bottom Nav
    },
    insightCard: {
        backgroundColor: '#E8F1FA', // Light blue
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    bulbIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    insightTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2A2A5B',
    },
    insightText: {
        fontSize: 16,
        color: '#4A5568',
        lineHeight: 24,
    },
    previousMessagesButton: {
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: 'white',
        marginBottom: 20,
    },
    previousMessagesText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4A5568',
    },
    chipsContainer: {
        marginBottom: 20,
        maxHeight: 50,
    },
    chipsContent: {
        paddingHorizontal: 4,
    },
    chip: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 12,
        justifyContent: 'center',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2D3748',
    },
    fakeInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 28,
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    fakeInputText: {
        flex: 1,
        color: '#A0AEC0',
        fontSize: 16,
    },
    sendIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#A0AEC0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclaimer: {
        textAlign: 'center',
        fontSize: 12,
        color: '#718096',
        marginBottom: 16,
    },
    fab: {
        position: 'absolute',
        bottom: 90, // Above bottom nav
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primaryAction,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primaryAction,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        zIndex: 10,
    },
    fabIcon: {
        fontSize: 24,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopWidth: 1,
        borderTopColor: '#F7FAFC',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 10,
    },
    navItem: {
        alignItems: 'center',
    },
    navIconContainer: {
        width: 32,
        height: 32,
        marginBottom: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    navIcon: {
        fontSize: 20,
        color: '#718096',
    },
    navIconActive: {
        backgroundColor: '#2A2A5B',
    },
    navLabel: {
        fontSize: 10,
        color: '#718096',
    },
    navLabelActive: {
        color: '#2A2A5B',
        fontWeight: 'bold',
    },
});
