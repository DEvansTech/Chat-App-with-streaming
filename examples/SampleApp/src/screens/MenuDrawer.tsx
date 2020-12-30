import React, { useContext } from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Edit, Group, User, useTheme } from 'stream-chat-react-native/v2';

import { AppContext } from '../context/AppContext';

import type { DrawerContentComponentProps } from '@react-navigation/drawer';

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  container: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 16,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuTitle: {
    fontSize: 14,
    marginLeft: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 8,
  },
});

export const MenuDrawer: React.FC<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const {
    theme: {
      colors: { black, grey, white_snow },
    },
  } = useTheme();

  const { chatClient, logout } = useContext(AppContext);

  if (!chatClient) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: white_snow }]}>
      <View style={styles.userRow}>
        <Image
          source={{
            uri: chatClient.user?.image,
          }}
          style={styles.avatar}
        />
        <Text
          style={[
            styles.userName,
            {
              color: black,
            },
          ]}
        >
          {chatClient.user?.name}
        </Text>
      </View>
      <View style={styles.menuContainer}>
        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewDirectMessagingScreen')}
            style={styles.menuItem}
          >
            <Edit height={24} pathFill={grey} width={24} />
            <Text
              style={[
                styles.menuTitle,
                {
                  color: black,
                },
              ]}
            >
              New Direct Messages
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('NewGroupChannelAddMemberScreen')
            }
            style={styles.menuItem}
          >
            <Group height={24} pathFill={grey} width={24} />
            <Text
              style={[
                styles.menuTitle,
                {
                  color: black,
                },
              ]}
            >
              New Group
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
          style={styles.menuItem}
        >
          <User height={24} pathFill={grey} width={24} />
          <Text
            style={[
              styles.menuTitle,
              {
                color: black,
              },
            ]}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
