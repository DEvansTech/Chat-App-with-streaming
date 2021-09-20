import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import StreamMediaCache from '../StreamMediaCache';

import type {
  Channel,
  ChannelFilters,
  ChannelSort,
  ChannelStateAndDataInput,
  ChannelStateAndDataOutput,
  ClientStateAndData,
  OwnUserResponse,
  StreamChat,
  TokenOrProvider,
  UserResponse,
} from 'stream-chat';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../types/types';

import {
  CURRENT_CLIENT_VERSION,
  CURRENT_SDK_VERSION,
  STREAM_CHAT_CHANNELS_DATA,
  STREAM_CHAT_CHANNELS_ORDER,
  STREAM_CHAT_CLIENT_DATA,
  STREAM_CHAT_CLIENT_VERSION,
  STREAM_CHAT_SDK_VERSION,
} from './constants';

export type ChannelsOrder = { [index: string]: { [index: string]: number } };

export type CacheKeys =
  | typeof STREAM_CHAT_CLIENT_DATA
  | typeof STREAM_CHAT_CHANNELS_DATA
  | typeof STREAM_CHAT_SDK_VERSION
  | typeof STREAM_CHAT_CLIENT_VERSION
  | typeof STREAM_CHAT_CHANNELS_ORDER;

type CacheValuesDefault<
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Us extends UnknownType = DefaultUserType,
> = {
  STREAM_CHAT_CHANNELS_ORDER: ChannelsOrder;
  STREAM_CHAT_CLIENT_DATA: ClientStateAndData<Ch, Co, Us>;
  STREAM_CHAT_CLIENT_VERSION: string;
  STREAM_CHAT_SDK_VERSION: string;
};

type CacheValues<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
> = {
  get: CacheValuesDefault<Ch, Co, Us> & {
    STREAM_CHAT_CHANNELS_DATA: ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[];
  };
  set: CacheValuesDefault<Ch, Co, Us> & {
    STREAM_CHAT_CHANNELS_DATA: ChannelStateAndDataOutput<At, Ch, Co, Me, Re, Us>[];
  };
};

export type CacheInterface<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
> = {
  getItem: <Key extends CacheKeys>(
    key: Key,
  ) => Promise<CacheValues<At, Ch, Co, Me, Re, Us>['get'][Key] | null>;
  removeItem: <Key extends CacheKeys>(key: Key) => Promise<void>;
  setItem: <Key extends CacheKeys>(
    key: Key,
    value: CacheValues<At, Ch, Co, Me, Re, Us>['set'][Key] | null,
  ) => Promise<void>;
};

function extractChannelMessagesMap<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
>(channelsData: ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[] | null) {
  const oldChannelsMessagesMap =
    (channelsData || []).reduce((curr, next) => {
      if (next.id) {
        curr[next.id] = {};
        next.state.messages.forEach((message) => {
          curr[next.id as string][message.id] = true;
        });
        Object.values(next.state.threads).forEach((thread) =>
          thread.forEach((threadMessage) => {
            curr[next.id as string][threadMessage.id] = true;
          }),
        );
      }
      return curr;
    }, {} as { [cid: string]: { [mid: string]: true } }) || {};

  return oldChannelsMessagesMap;
}

export class StreamCache<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
> {
  public currentNetworkState: boolean | null;
  private static instance: StreamCache; // type is undefined|StreamChat, unknown is due to TS limitations with statics
  private static cacheMedia: boolean;
  private client: StreamChat<At, Ch, Co, Ev, Me, Re, Us>;
  private cacheInterface: CacheInterface<At, Ch, Co, Me, Re, Us>;
  private cachedChannelsOrder: ChannelsOrder;
  private orderedChannels: { [index: string]: Channel<At, Ch, Co, Ev, Me, Re, Us>[] };
  private tokenOrProvider: TokenOrProvider;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor(
    client: StreamChat<At, Ch, Co, Ev, Me, Re, Us>,
    cacheInterface: CacheInterface<At, Ch, Co, Me, Re, Us>,
    tokenOrProvider: TokenOrProvider,
  ) {
    this.client = client;
    this.cacheInterface = cacheInterface;
    this.currentNetworkState = null;
    this.cachedChannelsOrder = {};
    this.orderedChannels = {};
    this.tokenOrProvider = tokenOrProvider;

    this.startWatchers();
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance<
    At extends UnknownType = DefaultAttachmentType,
    Ch extends UnknownType = DefaultChannelType,
    Co extends string = DefaultCommandType,
    Ev extends UnknownType = DefaultEventType,
    Me extends UnknownType = DefaultMessageType,
    Re extends UnknownType = DefaultReactionType,
    Us extends UnknownType = DefaultUserType,
  >(
    client?: StreamChat<At, Ch, Co, Ev, Me, Re, Us>,
    cacheInterface?: CacheInterface<At, Ch, Co, Me, Re, Us>,
    tokenOrProvider?: TokenOrProvider,
    cacheMedia = true,
  ): StreamCache<At, Ch, Co, Ev, Me, Re, Us> {
    if (!StreamCache.instance) {
      if (!(client && cacheInterface)) {
        throw new Error('StreamCache should be initialized with client and cacheInterface params');
      }
      StreamCache.instance = new StreamCache(
        client,
        cacheInterface,
        tokenOrProvider,
      ) as unknown as StreamCache;

      StreamCache.cacheMedia = cacheMedia;
    }

    return StreamCache.instance as unknown as StreamCache<At, Ch, Co, Ev, Me, Re, Us>;
  }

  public static hasInstance() {
    return !!StreamCache.instance;
  }

  public static shouldCacheMedia() {
    return !!StreamCache.instance && StreamCache.cacheMedia;
  }

  private syncCache() {
    const { channels: currentChannelsData, client: currentClientData } = this.client.getStateData();
    return Promise.all([
      this.cacheInterface.setItem(STREAM_CHAT_SDK_VERSION, CURRENT_SDK_VERSION),
      this.cacheInterface.setItem(STREAM_CHAT_CLIENT_VERSION, CURRENT_CLIENT_VERSION),
      this.cacheInterface.setItem(STREAM_CHAT_CLIENT_DATA, currentClientData),
      this.cacheInterface.setItem(STREAM_CHAT_CHANNELS_DATA, currentChannelsData),
      this.cacheInterface.setItem(STREAM_CHAT_CHANNELS_ORDER, this.cachedChannelsOrder),
    ]);
  }

  private startWatchers() {
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        this.syncCache();
      }
    });

    NetInfo.addEventListener((state) => {
      if (state.isInternetReachable !== null && this.currentNetworkState === null) {
        this.currentNetworkState = state.isConnected && state.isInternetReachable;
        return;
      }

      if (state.isConnected && state.isInternetReachable && !this.currentNetworkState) {
        this.client.openConnection();
        this.currentNetworkState = true;
      } else if ((!state.isConnected || !state.isInternetReachable) && this.currentNetworkState) {
        this.currentNetworkState = false;
      }
    });
  }

  private offlineConnect(clientData: ClientStateAndData<Ch, Co, Us>) {
    const user = {
      id: clientData.user?.id,
      name: clientData.user?.name,
    } as OwnUserResponse<Ch, Co, Us> | UserResponse<Us>;

    return this.client.reInitializeAuthState(user, this.tokenOrProvider);
  }

  private orderChannelsBasedOnCachedOrder<
    C extends
      | Channel<At, Ch, Co, Ev, Me, Re, Us>[]
      | ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[],
  >(channels: C) {
    const channelsOrder = {} as { [index: string]: C };
    Object.keys(this.cachedChannelsOrder).forEach((currentChannelsOrderKey) => {
      const currentChannelsOrder = this.cachedChannelsOrder?.[currentChannelsOrderKey];
      const channelsIndicesMap = (
        channels as ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[]
      ).reduce((curr, next, index) => {
        if (!next.id || !currentChannelsOrder[next.id]) return curr;
        curr[next.id] = index;
        return curr;
      }, {} as { [index: string]: number });

      if (currentChannelsOrder) {
        channels.sort((a, b) => {
          if (a.id === undefined && b.id === undefined) return -1;
          if (a.id === undefined) return 1;
          if (b.id === undefined) return -1;

          if (currentChannelsOrder[a.id] === undefined && currentChannelsOrder[b.id] === undefined)
            return channelsIndicesMap[a.id] - channelsIndicesMap[b.id];

          if (currentChannelsOrder[a.id] === undefined) return 1;
          if (currentChannelsOrder[b.id] === undefined) return -1;

          return currentChannelsOrder[a.id] - currentChannelsOrder[b.id];
        });
      }
      channelsOrder[currentChannelsOrderKey] = (
        channels as ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[]
      ).filter((c) => c.id && currentChannelsOrder[c.id] !== undefined) as C;
    });
    return channelsOrder;
  }

  private async hasNewVersion() {
    const sdkCachedVersion = await this.cacheInterface.getItem(STREAM_CHAT_SDK_VERSION);
    const clientCachedVersion = await this.cacheInterface.getItem(STREAM_CHAT_CLIENT_VERSION);

    const sdkVersionChanged = sdkCachedVersion !== CURRENT_SDK_VERSION;
    const clientVersionChanged = clientCachedVersion !== CURRENT_CLIENT_VERSION;

    // This avoids problems if (accross versions) anything changes in the format of the cached data
    const versionChanged = !!(sdkVersionChanged || clientVersionChanged);

    if (versionChanged) {
      console.info('Stream libraries changed version. Cleaning up cache...');
      this.clear();
    }

    return versionChanged;
  }

  public async hasCachedData() {
    const newVersion = await this.hasNewVersion();

    if (newVersion) {
      return false;
    }

    const clientData = await this.cacheInterface.getItem(STREAM_CHAT_CLIENT_DATA);
    const channelsData = await this.cacheInterface.getItem(STREAM_CHAT_CHANNELS_DATA);

    return !!(clientData && channelsData);
  }

  private async removeOlderImages(
    oldChannelsData: ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[],
    newChannelsData: ChannelStateAndDataInput<At, Ch, Co, Me, Re, Us>[],
  ) {
    const oldChannelsMessagesMap = extractChannelMessagesMap(oldChannelsData);
    const newChannelsMessagesMap = extractChannelMessagesMap(newChannelsData);

    const removedChannels: string[] = [];
    const removedMessages: { channelId: string; messageId: string }[] = [];

    // Extract array of paths for removed channels and messages
    Object.keys(oldChannelsMessagesMap).forEach((oldChannelId) => {
      if (!newChannelsMessagesMap[oldChannelId]) {
        removedChannels.push(oldChannelId);
        return;
      }

      Object.keys(oldChannelsMessagesMap[oldChannelId]).forEach((oldMessageId) => {
        if (!newChannelsMessagesMap[oldChannelId][oldMessageId]) {
          removedMessages.push({ channelId: oldChannelId, messageId: oldMessageId });
        }
      });
    });

    await Promise.all(
      removedChannels.map((channelId) =>
        Promise.all([
          StreamMediaCache.removeChannelAttachments(channelId),
          StreamMediaCache.removeChannelAvatars(channelId),
        ]),
      ),
    );

    await Promise.all(
      removedMessages.map(({ channelId, messageId }) =>
        StreamMediaCache.removeMessageAttachments(channelId, messageId),
      ),
    );
  }

  public async syncCacheAndImages() {
    const oldChannelsData = await this.cacheInterface.getItem(STREAM_CHAT_CHANNELS_DATA);
    await this.syncCache();
    const newChannelsData = await this.cacheInterface.getItem(STREAM_CHAT_CHANNELS_DATA);

    if (!oldChannelsData) return;

    await this.removeOlderImages(oldChannelsData, newChannelsData || []);
  }

  private async rehydrate(clientData: ClientStateAndData<Ch, Co, Us>) {
    const channelsData = await this.cacheInterface.getItem(STREAM_CHAT_CHANNELS_DATA);

    this.cachedChannelsOrder =
      (await this.cacheInterface.getItem(STREAM_CHAT_CHANNELS_ORDER)) || {};

    if (clientData && channelsData) {
      this.client.reInitializeWithState(clientData, channelsData || []);
      this.orderedChannels = this.orderChannelsBasedOnCachedOrder(
        Object.values(this.client.activeChannels),
      );
    }
  }

  public async initialize({ openConnection = true } = {}) {
    const clientData = await this.cacheInterface.getItem(STREAM_CHAT_CLIENT_DATA);
    if (clientData) {
      await this.offlineConnect(clientData);
      await this.rehydrate(clientData);
      // If users want to manually control the socket connection when offline, just send this parameter as false
      if (openConnection) {
        this.client.openConnection();
      }
    }
  }

  private getChannelsOrderKey(filters: ChannelFilters<Ch, Co, Us>, sort: ChannelSort<Ch>) {
    return `${JSON.stringify(filters)}_${JSON.stringify(sort)}`;
  }

  public getOrderedChannels(filters: ChannelFilters<Ch, Co, Us>, sort: ChannelSort<Ch>) {
    return this.orderedChannels[this.getChannelsOrderKey(filters, sort)] || [];
  }

  public syncChannelsCachedOrder(
    channels: Channel<At, Ch, Co, Ev, Me, Re, Us>[],
    filters: ChannelFilters<Ch, Co, Us>,
    sort: ChannelSort<Ch>,
  ) {
    this.cachedChannelsOrder[this.getChannelsOrderKey(filters, sort)] = channels.reduce(
      (acc, next, index) => {
        if (next.id) {
          acc[next.id] = index;
        }
        return acc;
      },
      {} as { [index: string]: number },
    );
  }

  public clear() {
    return Promise.all([
      this.cacheInterface.removeItem(STREAM_CHAT_SDK_VERSION),
      this.cacheInterface.removeItem(STREAM_CHAT_CLIENT_VERSION),
      this.cacheInterface.removeItem(STREAM_CHAT_CLIENT_DATA),
      this.cacheInterface.removeItem(STREAM_CHAT_CHANNELS_DATA),
      this.cacheInterface.removeItem(STREAM_CHAT_CHANNELS_ORDER),
      StreamMediaCache.clear(),
    ]);
  }
}
