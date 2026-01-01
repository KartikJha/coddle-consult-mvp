import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, SafeAreaView, ScrollView, ActivityIndicator, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';
import * as Haptics from 'expo-haptics';
import { impactAsync, selectionAsync, notificationAsync } from '../utils/haptics';
import { colors } from '../theme/colors';
import MainLayout from '../components/MainLayout';

type ProviderScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Provider'>;

export default function ProviderScreen() {
  const navigation = useNavigation<ProviderScreenNavigationProp>();
  const { supportType } = useConsult();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  // Animation for Lock Icon
  const lockScale = useRef(new Animated.Value(1)).current;

  const handlePay = () => {
    if (!agreed) {
      notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Required', 'Please acknowledge the consent form to proceed.');
      return;
    }

    impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setLoading(true);
    setLoadingText('Securing payment...');

    // Animate Lock
    Animated.sequence([
      Animated.timing(lockScale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(lockScale, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    // Mock steps
    setTimeout(() => {
      setLoadingText('Confirming provider...');
    }, 1500);

    setTimeout(() => {
      setLoading(false);
      notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (supportType === 'chat') {
        navigation.navigate('Chat');
      } else {
        navigation.navigate('Completion');
      }
    }, 3000);
  };

  const toggleAgree = () => {
    selectionAsync();
    setAgreed(!agreed);
  }

  return (
    <MainLayout variant="main" showBack={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 16, color: colors.textSecondary }}>← Back</Text>
        </TouchableOpacity>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: '66%' }]} />
        </View>
        <Text style={styles.stepIndicator}>Step 2 of 3</Text>
        <Text style={styles.title}>Your Expert</Text>

        <View style={styles.providerCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Dr.</Text>
          </View>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>Dr. Emily Chen</Text>
            <Text style={styles.providerCreds}>Pediatric Sleep Specialist</Text>
            <Text style={styles.providerBio}>
              10+ years helping families building healthy sleep habits. Compassionate and evidence-based approach.
            </Text>
          </View>
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {supportType === 'chat' ? 'Chat Consultation' : 'Video Consultation'}
            </Text>
            <Text style={styles.summaryPrice}>$20.00</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.checkboxContainer}
          onPress={toggleAgree}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>
            I understand that this is non-medical advice and not a replacement for emergency care.
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primaryAction} />
              <Text style={styles.loadingText}>{loadingText}</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.button}
              onPress={handlePay}
            >
              <View style={styles.buttonContent}>
                <Animated.Text style={{ fontSize: 20, marginRight: 8, transform: [{ scale: lockScale }] }}>🔒</Animated.Text>
                <Text style={styles.buttonText}>Confirm & Pay $20.00</Text>
              </View>
            </TouchableOpacity>
          )}

          {!loading && (
            <View style={styles.secureBadge}>
              <Text style={styles.secureText}>SSL Secure Payment</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E6E6FA',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.progressStep,
    borderRadius: 3,
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  providerCard: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.systemBubble,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  providerCreds: {
    fontSize: 14,
    color: colors.progressStep,
    marginBottom: 8,
    fontWeight: '600',
  },
  providerBio: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 40,
    paddingRight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: colors.white,
  },
  checkboxChecked: {
    backgroundColor: colors.progressStep,
    borderColor: colors.progressStep,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  secureBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  secureText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
});
