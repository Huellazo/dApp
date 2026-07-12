import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tourism tab by default
  return <Redirect href="/(tabs)/tourism" />;
}
