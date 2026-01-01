import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';

type ProviderScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Provider'>;

export default function ProviderScreen() {
  const navigation = useNavigation<ProviderScreenNavigationProp>();
  const { supportType } = useConsult();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    if (!agreed) {
      Alert.alert('Required', 'Please acknowledge the consent form to proceed.');
      return;
    }

    setLoading(true);
    // Mock payment delay
    setTimeout(() => {
      setLoading(false);
      if (supportType === 'chat') {
        navigation.navigate('Chat');
      } else {
        // Bonus: could go to a Video waiting room or similar.
        // For MVP core requirements, we can re-use completion or just alert.
        // Let's implement a simple alert for now or route to completion if strictly following core.
        // The plan mentioned "Chat (if chat selected) or Completion/VideoStub".
        // Let's go to Completion for Video for now as a "Booking Confirmed" state.
        navigation.navigate('Completion');
      }
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>
            I understand that this is non-medical advice and not a replacement for emergency care.
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handlePay}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Confirm & Pay $20.00</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  providerCard: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#fff',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  providerCreds: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 8,
    fontWeight: '600',
  },
  providerBio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginTop: 'auto',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
