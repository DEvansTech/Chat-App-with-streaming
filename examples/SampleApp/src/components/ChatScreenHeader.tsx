import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { Spinner, useChatContext, useTheme } from 'stream-chat-react-native/v2';

import { RoundButton } from './RoundButton';
import { ScreenHeader } from './ScreenHeader';

import { AppContext } from '../context/AppContext';
import { NewDirectMessageIcon } from '../icons/NewDirectMessageIcon';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
  DrawerNavigatorParamList,
  StackNavigatorParamList,
} from '../types';

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  networkDownContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  networkDownText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 13,
  },
});

type ChatScreenHeaderNavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<DrawerNavigatorParamList>,
  StackNavigationProp<StackNavigatorParamList>
>;

export const NetworkDownIndicator: React.FC = () => {
  const {
    theme: {
      colors: { black },
    },
  } = useTheme();

  return (
    <View style={styles.networkDownContainer}>
      <Spinner />
      <Text
        style={[
          styles.networkDownText,
          {
            color: black,
          },
        ]}
      >
        Searching for network
      </Text>
    </View>
  );
};

export const ChatScreenHeader: React.FC<{ title?: string }> = ({
  title = 'Stream Chat',
}) => {
  const {
    theme: {
      colors: { accent_blue },
    },
  } = useTheme();
  const navigation = useNavigation<ChatScreenHeaderNavigationProp>();
  const { chatClient } = useContext(AppContext);
  const { isOnline } = useChatContext();

  return (
    <ScreenHeader
      LeftContent={() => (
        <TouchableOpacity onPress={navigation.openDrawer}>
          <Image
            source={{
              uri: chatClient?.user?.image,
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      )}
      RightContent={() => (
        <RoundButton
          onPress={() => {
            navigation.navigate('NewDirectMessagingScreen');
          }}
        >
          <NewDirectMessageIcon
            active
            color={accent_blue}
            height={25}
            width={25}
          />
        </RoundButton>
      )}
      Title={isOnline ? undefined : NetworkDownIndicator}
      titleText={title}
    />
  );
};
