import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useConsult } from '../context/ConsultContext';

type CompletionScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Completion'>;

export default function CompletionScreen() {
  const navigation = useNavigation<CompletionScreenNavigationProp>();
  const { reset, setSupportType } = useConsult();

  useEffect(() => {
    // Optional: could auto-reset context or do cleanup here
  }, []);

  const handleNewChat = () => {
    reset();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }, { name: 'Concern' }],
    });
  };

  const handleBookVideo = () => {
    reset();
    setSupportType('video');
    // Navigate to Concern (as step 1) but with video pre-selected contextually, 
    // or arguably back to Intro. Let's go to Concern to let them re-enter/confirm concern.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }, { name: 'Concern' }],
    });
  };

  const handleHome = () => {
    reset();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Intro' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🎉</Text>
        </View>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#e6f0ff',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  textButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  textButtonText: {
    color: '#666',
    fontSize: 16,
  }
});
