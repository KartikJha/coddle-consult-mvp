import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Animated, Platform, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import * as Haptics from 'expo-haptics';
import { impactAsync, selectionAsync } from '../utils/haptics';
import { theme, colors } from '../theme/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type IntroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Intro'>;

export default function IntroScreen() {
  const navigation = useNavigation<IntroScreenNavigationProp>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Concern');
  };

  const handleCardPress = () => {
    selectionAsync();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.title}>Coddle Consult</Text>
          <Text style={styles.subtitle}>
            Get expert advice for your parenting concerns, from real clinicians.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>How we can help</Text>

          <TouchableOpacity activeOpacity={0.7} onPress={handleCardPress} style={styles.optionCard}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>💬</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Chat Advice</Text>
              <Text style={styles.optionDesc}>
                Text with a clinician for quick answers and reassuring guidance.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handleCardPress} style={styles.optionCard}>
            <View style={styles.iconPlaceholder}>
              <Text style={styles.iconText}>📹</Text>
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Video Consult</Text>
              <Text style={styles.optionDesc}>
                Book a face-to-face video session for in-depth support.
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Cream
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary, // Navy
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24, // More rounded
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.systemBubble, // Lavender
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700', // Bolder
    color: colors.textPrimary,
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    backgroundColor: colors.primaryAction, // Salmon
    borderRadius: 30, // Pill
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.primaryAction,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
