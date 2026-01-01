import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface BottomNavProps {
    activeTab?: string;
    onTabPress?: (tab: string) => void;
}

export default function BottomNav({ activeTab = 'AI Assistant', onTabPress }: BottomNavProps) {
    const tabs = [
        { icon: "🏠", label: "Home" },
        { icon: "🤖", label: "AI Assistant" },
        { icon: "📅", label: "History" },
        { icon: "📊", label: "Insights" },
        { icon: "⚙️", label: "Settings" },
        { icon: "👶", label: "Child" },
    ];

    return (
        <View style={styles.bottomNav}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.label}
                    style={styles.navItem}
                    activeOpacity={0.8}
                    onPress={() => onTabPress && onTabPress(tab.label)}
                >
                    <View style={[styles.navIconContainer, activeTab === tab.label && styles.navIconActive]}>
                        <Text style={[styles.navIcon, activeTab === tab.label && { color: 'white' }]}>{tab.icon}</Text>
                    </View>
                    <Text style={[styles.navLabel, activeTab === tab.label && styles.navLabelActive]}>{tab.label}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
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
