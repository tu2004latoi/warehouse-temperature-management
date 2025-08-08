import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export default function NotificationSetup({ onTokenReceived }) {
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      console.log("🔔 Notification Setup Start");

      if (!Device.isDevice) {
        alert('Must use physical device for Push Notifications');
        console.log("⚠️ Not a physical device");
        return;
      }

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          console.log("❌ Permission not granted");
          return;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync();
        const expoPushToken = tokenData.data;

        console.log("✅ Expo Push Token:", expoPushToken);
        if (onTokenReceived) onTokenReceived(expoPushToken);
      } catch (err) {
        console.error("❌ Error getting push token", err);
      }
    };

    registerForPushNotificationsAsync();
  }, []);

  return null;
}
