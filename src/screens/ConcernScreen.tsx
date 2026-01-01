import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, LayoutAnimation, UIManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';
import * as Haptics from 'expo-haptics';
import { impactAsync, selectionAsync } from '../utils/haptics';

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 24,
    flexGrow: 1,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    minHeight: 140,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#fff0f0',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
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
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#eff6ff',
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '700',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
