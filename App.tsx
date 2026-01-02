import AppNavigator from './src/navigation/AppNavigator';
import { ConsultProvider } from './src/context/ConsultContext';

export default function App() {
  return (
    <ConsultProvider>
      <AppNavigator />
    </ConsultProvider>
  );
}
