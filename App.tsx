// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import AppNavigator from './src/navigation/AppNavigator';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.tsx to start working on your app!</Text>
//       <AppNavigator />
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


import AppNavigator from './src/navigation/AppNavigator';
import { ConsultProvider } from './src/context/ConsultContext';

export default function App() {
  return (
    <ConsultProvider>
      <AppNavigator />
    </ConsultProvider>
  );
}
