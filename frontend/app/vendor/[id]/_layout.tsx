import { Stack } from 'expo-router';
import { Colors } from '../../../constants/colors';

export default function VendorLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.backgroundDark },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="products" />
    </Stack>
  );
}
