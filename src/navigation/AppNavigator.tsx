import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import IntroScreen from '../screens/IntroScreen';
import ConcernScreen from '../screens/ConcernScreen';
import ProviderScreen from '../screens/ProviderScreen';
import ChatScreen from '../screens/ChatScreen';
import CompletionScreen from '../screens/CompletionScreen';
import CustomHeader from '../components/CustomHeader';
import { theme } from '../theme/colors';

export type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  Concern: undefined;
  Provider: undefined;
  Chat: undefined;
  Completion: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: ({ navigation, route, options }) => {
            const title = options.title;
            const showBack = navigation.canGoBack();
            return <CustomHeader title={title} showBack={showBack} />;
          },
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            header: () => <CustomHeader variant="main" showBack={false} />,
          }}
        />
        <Stack.Screen
          name="Intro"
          component={IntroScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Concern"
          component={ConcernScreen}
          options={{ title: 'Check-in' }}
        />
        <Stack.Screen
          name="Provider"
          component={ProviderScreen}
          options={{ title: 'Expert' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: 'Consult' }}
        />
        <Stack.Screen
          name="Completion"
          component={CompletionScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
