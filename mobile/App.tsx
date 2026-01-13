import { registerRootComponent } from 'expo';
import HomeScreen from './src/screens/HomeScreen';

// Create a simple App component that wraps HomeScreen
// This satisfies the expectation of Expo's default AppEntry.js
export default function App() {
  return <HomeScreen />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
