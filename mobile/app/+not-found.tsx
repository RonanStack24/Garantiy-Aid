import { router } from 'expo-router';
import { Button, Page, Txt } from '../src/components';
export default function NotFound() {
  return (
    <Page title="GarantiyAid">
      <Txt variant="title">Screen not found</Txt>
      <Txt>This link is unavailable. Return to the app to continue.</Txt>
      <Button onPress={() => router.replace('/')}>Back to welcome</Button>
    </Page>
  );
}
