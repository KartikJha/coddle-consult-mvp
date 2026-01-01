import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';
import * as Haptics from 'expo-haptics';
import { impactAsync } from '../utils/haptics';
import { colors } from '../theme/colors';

type CompletionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Completion'>;

export default function CompletionScreen() {
  const navigation = useNavigation<CompletionScreenNavigationProp>();
  const { reset, setSupportType } = useConsult();

  // Animation
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNewChat = () => {
    impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    reset();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }, { name: 'Concern' }],
    });
  };

  const handleBookVideo = () => {
    impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    reset();
    setSupportType('video');
    // Navigate to Concern (as step 1) but with video pre-selected contextually
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }, { name: 'Concern' }],
    });
  };

  const handleHome = () => {
    impactAsync(Haptics.ImpactFeedbackStyle.Light);
    reset();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.icon}>🎉</Text>
        </Animated.View>
        <Text style={styles.title}>All Set!</Text>
        <Text style={styles.message}>
          Thank you for using Coddle Consult. We hope the advice was helpful.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNewChat}>
            <Text style={styles.primaryButtonText}>Start Another Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleBookVideo}>
            <Text style={styles.secondaryButtonText}>Book Video Consult</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.textButton} onPress={handleHome}>
            <Text style={styles.textButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: colors.primaryAction,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: colors.primaryAction,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: 'transparent', // For sizing match if needed, or specific border color
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  secondaryButtonText: {
    color: colors.primaryAction,
    fontSize: 18,
    fontWeight: 'bold',
  },
  textButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  textButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  }
});
