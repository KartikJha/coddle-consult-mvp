import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';

type ConcernScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Concern'>;

export default function ConcernScreen() {
  const navigation = useNavigation<ConcernScreenNavigationProp>();
  const { concern, setConcern, supportType, setSupportType } = useConsult();
  const [localConcern, setLocalConcern] = useState(concern);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!localConcern.trim()) {
      setError('Please describe your concern to proceed.');
      return;
    }
    setConcern(localConcern);
    navigation.navigate('Provider');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.stepIndicator}>Step 1 of 3</Text>
          <Text style={styles.title}>What's on your mind?</Text>
          <Text style={styles.subtitle}>
            describe the issue you're facing with your child so we can match you with the right expert.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="E.g., My 2-year old is refusing to eat..."
              multiline
              textAlignVertical="top"
              value={localConcern}
              onChangeText={(text) => {
                setLocalConcern(text);
                if (error) setError('');
              }}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Text style={styles.label}>I would like to:</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                supportType === 'chat' && styles.optionSelected,
              ]}
              onPress={() => setSupportType('chat')}
            >
              <Text style={[
                styles.optionText,
                supportType === 'chat' && styles.optionTextSelected
              ]}>💬 Chat with an Expert</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                supportType === 'video' && styles.optionSelected,
              ]}
              onPress={() => setSupportType('video')}
            >
              <Text style={[
                styles.optionText,
                supportType === 'video' && styles.optionTextSelected
              ]}>📹 Book Video Call</Text>
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
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
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
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f0ff',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
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
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
