import { useEffect, useRef, useState } from 'react';
import { StreamChat } from 'stream-chat';
import messaging from '@react-native-firebase/messaging';
import { Alert, Linking, Platform } from 'react-native';
import notifee from '@notifee/react-native';

import { USER_TOKENS, USERS } from '../ChatUsers';
import AsyncStore from '../utils/AsyncStore';

import type { LoginConfig, StreamChatGenerics } from '../types';

// Request Push Notification permission from device.
const requestNotificationPermission = async () => {
  const permissionAuthStatus = await messaging().hasPermission();
  const isDenied = permissionAuthStatus === messaging.AuthorizationStatus.DENIED;
  if (isDenied) {
    // Go to app settings page, if the permissions were denied before
    Alert.alert(
      'Notification Permission',
      'Please provide notifications permission through Settings',
      [
        {
          onPress: () => console.log('Push notification permissions are ignored'),
          style: 'cancel',
          text: 'Cancel',
        },
        { onPress: () => Linking.openSettings(), text: 'OK' },
      ],
    );
  } else {
    const authStatus = await messaging().requestPermission();
    const isEnabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log('Permission Status', { authStatus, isEnabled });
  }
};

export const useChatClient = () => {
  const [chatClient, setChatClient] = useState<StreamChat<StreamChatGenerics> | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const unsubscribePushListenersRef = useRef<() => void>();

  /**
   * @param config the user login config
   * @returns function to unsubscribe from listeners
   */
  const loginUser = async (config: LoginConfig) => {
    // unsubscribe from previous push listeners
    unsubscribePushListenersRef.current?.();
    const client = StreamChat.getInstance<StreamChatGenerics>(config.apiKey, {
      timeout: 6000,
    });

    const user = {
      id: config.userId,
      image: config.userImage,
      name: config.userName,
    };

    await client.connectUser(user, config.userToken);
    await AsyncStore.setItem('@stream-rn-sampleapp-login-config', config);

    // Register FCM token with stream chat server.
    const token = await messaging().getToken();
    await client.addDevice(token, 'firebase');

    // Listen to new FCM tokens and register them with stream chat server.
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      await client.addDevice(newToken, 'firebase');
    });
    // show notifications when on foreground
    const unsubscribeForegroundMessageReceive = messaging().onMessage(async (remoteMessage) => {
      const fcmId = remoteMessage.data?.id;
      if (!fcmId) return;
      const message = await client.getMessage(fcmId);
      // on iOS when on foreground no notifications are shown
      // on Android when on foreground data only notifications are not shown
      const isNotificationHidden = !remoteMessage.notification || Platform.OS === 'ios';

      if (isNotificationHidden && message.message.user?.name && message.message.text) {
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
        const authStatus = await messaging().hasPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (!enabled) return;

        await notifee.displayNotification({
          android: {
            channelId,
          },
          body: message.message.text,
          title: 'New message from ' + message.message.user.name,
        });
      }
    });

    unsubscribePushListenersRef.current = () => {
      unsubscribeTokenRefresh();
      unsubscribeForegroundMessageReceive();
    };

    setChatClient(client);
  };

  const switchUser = async (userId?: string) => {
    setIsConnecting(true);

    try {
      if (userId) {
        await loginUser({
          apiKey: 'yjrt5yxw77ev',
          userId: USERS[userId].id,
          userImage: USERS[userId].image,
          userName: USERS[userId].name,
          userToken: USER_TOKENS[userId],
        });
      } else {
        const config = await AsyncStore.getItem<LoginConfig | null>(
          '@stream-rn-sampleapp-login-config',
          null,
        );

        if (config) {
          await loginUser(config);
        }
      }
    } catch (e) {
      console.warn(e);
    }
    setIsConnecting(false);
  };

  const logout = async () => {
    setChatClient(null);
    chatClient?.disconnectUser();
    await AsyncStore.removeItem('@stream-rn-sampleapp-login-config');
  };

  useEffect(() => {
    requestNotificationPermission();
    switchUser();
    return unsubscribePushListenersRef.current;
  }, []);

  return {
    chatClient,
    isConnecting,
    loginUser,
    logout,
    switchUser,
  };
};
