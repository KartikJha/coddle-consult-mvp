import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import IntroScreen from '../screens/IntroScreen';
import ConcernScreen from '../screens/ConcernScreen';
import ProviderScreen from '../screens/ProviderScreen';
import ChatScreen from '../screens/ChatScreen';
import CompletionScreen from '../screens/CompletionScreen';

export type RootStackParamList = {
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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Concern" component={ConcernScreen} />
        <Stack.Screen name="Provider" component={ProviderScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Completion" component={CompletionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
