import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, LayoutAnimation, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';
import * as Haptics from 'expo-haptics';
import { impactAsync, selectionAsync } from '../utils/haptics';
import { colors } from '../theme/colors';
import MainLayout from '../components/MainLayout';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ConcernScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Concern'>;

export default function ConcernScreen() {
  const navigation = useNavigation<ConcernScreenNavigationProp>();
  const { concern, setConcern, supportType, setSupportType } = useConsult();
  const [localConcern, setLocalConcern] = useState(concern);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!localConcern.trim()) {
      impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setError('Please describe your concern to proceed.');
      return;
    }
    impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConcern(localConcern);
    navigation.navigate('Provider');
  };

  const handleSupportTypeSelect = (type: 'chat' | 'video') => {
    selectionAsync();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSupportType(type);
  }

  return (
    <MainLayout variant="main" showBack={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 16, color: colors.textSecondary }}>← Back</Text>
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '33%' }]} />
          </View>
          <Text style={styles.stepIndicator}>Step 1 of 3</Text>

          <Text style={styles.title}>What's on your mind?</Text>
          <Text style={styles.subtitle}>
            Describe the issue you're facing with your child so we can match you with the right expert.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="E.g., My 2-year old is refusing to eat..."
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
              value={localConcern}
              onChangeText={(text) => {
                setLocalConcern(text);
                if (error) {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setError('');
                }
              }}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Text style={styles.label}>I would like to:</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionButton,
                supportType === 'chat' && styles.optionSelected,
              ]}
              onPress={() => handleSupportTypeSelect('chat')}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>💬</Text>
              <Text style={[
                styles.optionText,
                supportType === 'chat' && styles.optionTextSelected
              ]}>Chat with Expert</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.optionButton,
                supportType === 'video' && styles.optionSelected,
              ]}
              onPress={() => handleSupportTypeSelect('video')}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>📹</Text>
              <Text style={[
                styles.optionText,
                supportType === 'video' && styles.optionTextSelected
              ]}>Book Video Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 24,
    flexGrow: 1,
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
    backgroundColor: colors.progressStep, // Royal Blue
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    fontSize: 16,
    minHeight: 140,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    textAlignVertical: 'top',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionSelected: {
    borderColor: colors.progressStep,
    backgroundColor: colors.systemBubble,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.progressStep,
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  button: {
    backgroundColor: colors.primaryAction, // Salmon
    borderRadius: 30,
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
