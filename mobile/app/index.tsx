import { Redirect } from 'expo-router';
import { Onboarding } from '../src/screens/entry';
import { useDemo } from '../src/state';

export default function Index() {
  const { accessToken } = useDemo();
  return accessToken ? <Redirect href="/(tabs)/home" /> : <Onboarding />;
}
