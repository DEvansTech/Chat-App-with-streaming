import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  KeyboardAvoidingViewProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ChannelState,
  Channel as ChannelType,
  EventHandler,
  logChatPromiseExecution,
  MessageResponse,
  SendMessageAPIResponse,
  StreamChat,
  Message as StreamMessage,
} from 'stream-chat';

import { useCreateChannelContext } from './hooks/useCreateChannelContext';
import { useCreateInputMessageInputContext } from './hooks/useCreateInputMessageInputContext';
import { useCreateMessagesContext } from './hooks/useCreateMessagesContext';
import { useCreateThreadContext } from './hooks/useCreateThreadContext';
import { useTargetedMessage } from './hooks/useTargetedMessage';
import { heavyDebounce } from './utils/debounce';
import { heavyThrottle, lightThrottle } from './utils/throttle';

import { Attachment as AttachmentDefault } from '../Attachment/Attachment';
import { AttachmentActions as AttachmentActionsDefault } from '../Attachment/AttachmentActions';
import { Card as CardDefault } from '../Attachment/Card';
import { FileAttachment as FileAttachmentDefault } from '../Attachment/FileAttachment';
import { FileAttachmentGroup as FileAttachmentGroupDefault } from '../Attachment/FileAttachmentGroup';
import { FileIcon as FileIconDefault } from '../Attachment/FileIcon';
import { Gallery as GalleryDefault } from '../Attachment/Gallery';
import { Giphy as GiphyDefault } from '../Attachment/Giphy';
import { EmptyStateIndicator as EmptyStateIndicatorDefault } from '../Indicators/EmptyStateIndicator';
import {
  LoadingErrorIndicator as LoadingErrorIndicatorDefault,
  LoadingErrorProps,
} from '../Indicators/LoadingErrorIndicator';
import { LoadingIndicator as LoadingIndicatorDefault } from '../Indicators/LoadingIndicator';
import { KeyboardCompatibleView as KeyboardCompatibleViewDefault } from '../KeyboardCompatibleView/KeyboardCompatibleView';
import { Message as MessageDefault } from '../Message/Message';
import { MessageAvatar as MessageAvatarDefault } from '../Message/MessageSimple/MessageAvatar';
import { MessageContent as MessageContentDefault } from '../Message/MessageSimple/MessageContent';
import { MessageReplies as MessageRepliesDefault } from '../Message/MessageSimple/MessageReplies';
import { MessageRepliesAvatars as MessageRepliesAvatarsDefault } from '../Message/MessageSimple/MessageRepliesAvatars';
import { MessageSimple as MessageSimpleDefault } from '../Message/MessageSimple/MessageSimple';
import { MessageStatus as MessageStatusDefault } from '../Message/MessageSimple/MessageStatus';
import { ReactionList as ReactionListDefault } from '../Message/MessageSimple/ReactionList';
import { AttachButton as AttachButtonDefault } from '../MessageInput/AttachButton';
import { CommandsButton as CommandsButtonDefault } from '../MessageInput/CommandsButton';
import { FileUploadPreview as FileUploadPreviewDefault } from '../MessageInput/FileUploadPreview';
import { ImageUploadPreview as ImageUploadPreviewDefault } from '../MessageInput/ImageUploadPreview';
import { MoreOptionsButton as MoreOptionsButtonDefault } from '../MessageInput/MoreOptionsButton';
import { SendButton as SendButtonDefault } from '../MessageInput/SendButton';
import { ShowThreadMessageInChannelButton as ShowThreadMessageInChannelButtonDefault } from '../MessageInput/ShowThreadMessageInChannelButton';
import { UploadProgressIndicator as UploadProgressIndicatorDefault } from '../MessageInput/UploadProgressIndicator';
import { DateHeader as DateHeaderDefault } from '../MessageList/DateHeader';
import { InlineUnreadIndicator as InlineUnreadIndicatorDefault } from '../MessageList/InlineUnreadIndicator';
import { MessageList as MessageListDefault } from '../MessageList/MessageList';
import { MessageSystem as MessageSystemDefault } from '../MessageList/MessageSystem';
import { ScrollToBottomButton as ScrollToBottomButtonDefault } from '../MessageList/ScrollToBottomButton';
import { TypingIndicator as TypingIndicatorDefault } from '../MessageList/TypingIndicator';
import { TypingIndicatorContainer as TypingIndicatorContainerDefault } from '../MessageList/TypingIndicatorContainer';
import { Reply as ReplyDefault } from '../Reply/Reply';

import {
  ChannelConfig,
  ChannelContextValue,
  ChannelProvider,
} from '../../contexts/channelContext/ChannelContext';
import {
  ChatContextValue,
  useChatContext,
} from '../../contexts/chatContext/ChatContext';
import {
  InputConfig,
  InputMessageInputContextValue,
  MessageInputProvider,
} from '../../contexts/messageInputContext/MessageInputContext';
import {
  MessagesConfig,
  MessagesContextValue,
  MessagesProvider,
} from '../../contexts/messagesContext/MessagesContext';
import {
  SuggestionsContextValue,
  SuggestionsProvider,
} from '../../contexts/suggestionsContext/SuggestionsContext';
import { useTheme } from '../../contexts/themeContext/ThemeContext';
import {
  ThreadContextValue,
  ThreadProvider,
} from '../../contexts/threadContext/ThreadContext';
import {
  TranslationContextValue,
  useTranslationContext,
} from '../../contexts/translationContext/TranslationContext';
import {
  LOLReaction,
  LoveReaction,
  ThumbsDownReaction,
  ThumbsUpReaction,
  WutReaction,
} from '../../icons';
import { FlatList as FlatListDefault } from '../../native';
import { generateRandomId, ReactionData } from '../../utils/utils';

import type { MessageType } from '../MessageList/hooks/useMessageList';

import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../types/types';

const styles = StyleSheet.create({
  selectChannel: { fontWeight: 'bold', padding: 16 },
});

export const reactionData: ReactionData[] = [
  {
    Icon: LoveReaction,
    type: 'love',
  },
  {
    Icon: ThumbsUpReaction,
    type: 'like',
  },
  {
    Icon: ThumbsDownReaction,
    type: 'sad',
  },
  {
    Icon: LOLReaction,
    type: 'haha',
  },
  {
    Icon: WutReaction,
    type: 'wow',
  },
];

/**
 * If count of unread messages is less than 4, then no need to scroll to first unread message,
 * since first unread message will be in visible frame anyways.
 */
const scrollToFirstUnreadThreshold = 4;

/**
 * Number of unread messages to show in first frame, when channel loads at first
 * unread message. Only applicable if unread count > scrollToFirstUnreadThreshold.
 */
const unreadMessagesOnInitialLoadLimit = 2;

export type ChannelPropsWithContext<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = Partial<
  Pick<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>,
    | 'channel'
    | 'EmptyStateIndicator'
    | 'enforceUniqueReaction'
    | 'giphyEnabled'
    | 'LoadingIndicator'
    | 'StickyHeader'
  >
> &
  Pick<ChatContextValue<At, Ch, Co, Ev, Me, Re, Us>, 'client'> &
  Partial<InputMessageInputContextValue<At, Ch, Co, Ev, Me, Re, Us>> &
  Partial<SuggestionsContextValue<Co, Us>> &
  Pick<TranslationContextValue, 't'> &
  Partial<
    Pick<
      MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us>,
      | 'additionalTouchableProps'
      | 'Attachment'
      | 'AttachmentActions'
      | 'AttachmentFileIcon'
      | 'Card'
      | 'CardCover'
      | 'CardFooter'
      | 'CardHeader'
      | 'DateHeader'
      | 'disableTypingIndicator'
      | 'dismissKeyboardOnMessageTouch'
      | 'FileAttachment'
      | 'FileAttachmentGroup'
      | 'FlatList'
      | 'formatDate'
      | 'Gallery'
      | 'Giphy'
      | 'InlineUnreadIndicator'
      | 'markdownRules'
      | 'Message'
      | 'MessageAvatar'
      | 'MessageContent'
      | 'messageContentOrder'
      | 'MessageFooter'
      | 'MessageHeader'
      | 'MessageList'
      | 'ScrollToBottomButton'
      | 'MessageReplies'
      | 'MessageRepliesAvatars'
      | 'MessageSimple'
      | 'MessageStatus'
      | 'MessageSystem'
      | 'MessageText'
      | 'myMessageTheme'
      | 'onDoubleTapMessage'
      | 'ReactionList'
      | 'Reply'
      | 'supportedReactions'
      | 'TypingIndicator'
      | 'TypingIndicatorContainer'
      | 'UrlPreview'
    >
  > &
  Partial<
    Pick<
      ThreadContextValue<At, Ch, Co, Ev, Me, Re, Us>,
      'allowThreadMessagesInChannel' | 'thread'
    >
  > & {
    /**
     * Additional props passed to keyboard avoiding view
     */
    additionalKeyboardAvoidingViewProps?: Partial<KeyboardAvoidingViewProps>;
    /**
     * Disables the channel UI if the channel is frozen
     */
    disableIfFrozenChannel?: boolean;
    /**
     * When true, disables the KeyboardCompatibleView wrapper
     *
     * Channel internally uses the [KeyboardCompatibleView](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/KeyboardCompatibleView/KeyboardCompatibleView.tsx)
     * component to adjust the height of Channel when the keyboard is opened or dismissed. This prop provides the ability to disable this functionality in case you
     * want to use [KeyboardAvoidingView](https://facebook.github.io/react-native/docs/keyboardavoidingview) or handle dismissal yourself.
     * KeyboardAvoidingView works well when your component occupies 100% of screen height, otherwise it may raise some issues.
     */
    disableKeyboardCompatibleView?: boolean;
    /**
     * Overrides the Stream default mark channel read request (Advanced usage only)
     * @param channel Channel object
     */
    doMarkReadRequest?: (
      channel: ChannelType<At, Ch, Co, Ev, Me, Re, Us>,
    ) => void;
    /**
     * Overrides the Stream default send message request (Advanced usage only)
     * @param channelId
     * @param messageData Message object
     */
    doSendMessageRequest?: (
      channelId: string,
      messageData: StreamMessage<At, Me, Us>,
    ) => Promise<SendMessageAPIResponse<At, Ch, Co, Me, Re, Us>>;
    /**
     * Overrides the Stream default update message request (Advanced usage only)
     * @param channelId
     * @param updatedMessage UpdatedMessage object
     */
    doUpdateMessageRequest?: (
      channelId: string,
      updatedMessage: Parameters<
        StreamChat<At, Ch, Co, Ev, Me, Re, Us>['updateMessage']
      >[0],
    ) => ReturnType<StreamChat<At, Ch, Co, Ev, Me, Re, Us>['updateMessage']>;
    /**
     * E.g. Once unread count exceeds 255, display unread count as 255+ instead of actual count.
     * Also 255 is the limit per Stream chat channel for unread count.
     */
    globalUnreadCountLimit?: number;
    /**
     * When true, messageList will be scrolled at first unread message, when opened.
     */
    initialScrollToFirstUnreadMessage?: boolean;
    keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
    /**
     * Custom wrapper component that handles height adjustment of Channel component when keyboard is opened or dismissed
     * Default component (accepts the same props): [KeyboardCompatibleView](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/KeyboardCompatibleView/KeyboardCompatibleView.tsx)
     *
     * **Example:**
     *
     * ```
     * <Channel
     *  channel={channel}
     *  KeyboardCompatibleView={(props) => {
     *    return (
     *      <KeyboardCompatibleView>
     *        {props.children}
     *      </KeyboardCompatibleView>
     *    )
     *  }}
     * />
     * ```
     */
    KeyboardCompatibleView?: React.ComponentType<KeyboardAvoidingViewProps>;
    keyboardVerticalOffset?: number;
    /**
     * Custom loading error indicator to override the Stream default
     */
    LoadingErrorIndicator?: React.ComponentType<LoadingErrorProps>;
    messageId?: string;
  };

export const ChannelWithContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: PropsWithChildren<ChannelPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>>,
) => {
  const {
    additionalKeyboardAvoidingViewProps,
    additionalTextInputProps,
    additionalTouchableProps,
    allowThreadMessagesInChannel = true,
    AttachButton = AttachButtonDefault,
    Attachment = AttachmentDefault,
    AttachmentActions = AttachmentActionsDefault,
    AttachmentFileIcon = FileIconDefault,
    Card = CardDefault,
    CardCover,
    CardFooter,
    CardHeader,
    channel,
    children,
    client,
    closeSuggestions,
    CommandsButton = CommandsButtonDefault,
    compressImageQuality,
    DateHeader = DateHeaderDefault,
    disableIfFrozenChannel = true,
    disableKeyboardCompatibleView = false,
    disableTypingIndicator,
    dismissKeyboardOnMessageTouch = true,
    doDocUploadRequest,
    doImageUploadRequest,
    doMarkReadRequest,
    doSendMessageRequest,
    doUpdateMessageRequest,
    EmptyStateIndicator = EmptyStateIndicatorDefault,
    enforceUniqueReaction = false,
    FileAttachment = FileAttachmentDefault,
    FileAttachmentGroup = FileAttachmentGroupDefault,
    FileUploadPreview = FileUploadPreviewDefault,
    FlatList = FlatListDefault,
    formatDate,
    Gallery = GalleryDefault,
    Giphy = GiphyDefault,
    giphyEnabled,
    globalUnreadCountLimit = 255,
    hasFilePicker = true,
    hasImagePicker = true,
    ImageUploadPreview = ImageUploadPreviewDefault,
    initialScrollToFirstUnreadMessage = false,
    initialValue,
    InlineUnreadIndicator = InlineUnreadIndicatorDefault,
    Input,
    keyboardBehavior,
    KeyboardCompatibleView = KeyboardCompatibleViewDefault,
    keyboardVerticalOffset,
    LoadingErrorIndicator = LoadingErrorIndicatorDefault,
    LoadingIndicator = LoadingIndicatorDefault,
    markdownRules,
    messageId,
    maxNumberOfFiles = 10,
    Message = MessageDefault,
    MessageAvatar = MessageAvatarDefault,
    MessageContent = MessageContentDefault,
    messageContentOrder = ['gallery', 'files', 'text', 'attachments'],
    MessageFooter,
    MessageHeader,
    MessageList = MessageListDefault,
    myMessageTheme,
    ScrollToBottomButton = ScrollToBottomButtonDefault,
    MessageReplies = MessageRepliesDefault,
    MessageRepliesAvatars = MessageRepliesAvatarsDefault,
    MessageSimple = MessageSimpleDefault,
    MessageStatus = MessageStatusDefault,
    MessageSystem = MessageSystemDefault,
    MessageText,
    MoreOptionsButton = MoreOptionsButtonDefault,
    numberOfLines = 5,
    onChangeText,
    onDoubleTapMessage,
    openSuggestions,
    ReactionList = ReactionListDefault,
    Reply = ReplyDefault,
    SendButton = SendButtonDefault,
    sendImageAsync = false,
    setInputRef,
    ShowThreadMessageInChannelButton = ShowThreadMessageInChannelButtonDefault,
    StickyHeader,
    supportedReactions = reactionData,
    t,
    thread: threadProps,
    TypingIndicator = TypingIndicatorDefault,
    TypingIndicatorContainer = TypingIndicatorContainerDefault,
    updateSuggestions,
    UploadProgressIndicator = UploadProgressIndicatorDefault,
    UrlPreview = CardDefault,
  } = props;

  const {
    theme: {
      channel: { selectChannel },
      colors: { black },
    },
  } = useTheme();

  const [editing, setEditing] = useState<
    boolean | MessageType<At, Ch, Co, Ev, Me, Re, Us>
  >(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastRead, setLastRead] = useState<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['lastRead']
  >();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [loadingMoreRecent, setLoadingMoreRecent] = useState(false);
  const [messages, setMessages] = useState<
    MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us>['messages']
  >([]);

  const [members, setMembers] = useState<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['members']
  >({});
  const [quotedMessage, setQuotedMessage] = useState<
    boolean | MessageType<At, Ch, Co, Ev, Me, Re, Us>
  >(false);
  const [read, setRead] = useState<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['read']
  >({});
  const [thread, setThread] = useState<
    ThreadContextValue<At, Ch, Co, Ev, Me, Re, Us>['thread']
  >(threadProps || null);
  const [threadHasMore, setThreadHasMore] = useState(true);
  const [threadLoadingMore, setThreadLoadingMore] = useState(false);
  const [threadMessages, setThreadMessages] = useState<
    ThreadContextValue<At, Ch, Co, Ev, Me, Re, Us>['threadMessages']
  >((threadProps?.id && channel?.state?.threads?.[threadProps.id]) || []);
  const [typing, setTyping] = useState<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['typing']
  >({});
  const [watcherCount, setWatcherCount] = useState<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['watcherCount']
  >();
  const [watchers, setWatchers] = useState<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['watchers']
  >({});

  const { setTargetedMessage, targetedMessage } = useTargetedMessage(messageId);

  const channelId = channel?.id || '';
  useEffect(() => {
    if (channel) {
      if (messageId) {
        loadChannelAtMessage({ messageId });
      } else if (
        initialScrollToFirstUnreadMessage &&
        channel.countUnread() > scrollToFirstUnreadThreshold
      ) {
        loadChannelAtFirstUnreadMessage();
      } else {
        loadChannel();
      }
    }

    return () => {
      client.off('connection.recovered', handleEvent);
      channel?.off?.(handleEvent);
      copyChannelState.cancel();
      loadMoreFinished.cancel();
      loadMoreThreadFinished.cancel();
    };
  }, [channelId, messageId]);

  const threadPropsExists = !!threadProps;
  useEffect(() => {
    if (threadProps) {
      setThread(threadProps);
      if (channel && threadProps?.id) {
        setThreadMessages(channel.state.threads?.[threadProps.id] || []);
      }
    } else {
      setThread(null);
    }
  }, [threadPropsExists]);

  /**
   * CHANNEL CONSTANTS
   */
  const isAdmin =
    client?.user?.role === 'admin' ||
    channel?.state.membership.role === 'admin';

  const isModerator =
    channel?.state.membership.role === 'channel_moderator' ||
    channel?.state.membership.role === 'moderator';

  const isOwner = channel?.state.membership.role === 'owner';

  /**
   * CHANNEL METHODS
   */

  const markRead: ChannelContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['markRead'] = lightThrottle(() => {
    if (channel?.disconnected || !channel?.getConfig?.()?.read_events) {
      return;
    }

    if (doMarkReadRequest) {
      doMarkReadRequest(channel);
    } else {
      logChatPromiseExecution(channel.markRead(), 'mark read');
    }
  });

  const copyChannelState = lightThrottle(() => {
    setLoading(false);
    if (channel) {
      setMembers({ ...channel.state.members });
      setMessages([...channel.state.messages]);
      setRead({ ...channel.state.read });
      setTyping({ ...channel.state.typing });
      setWatcherCount(channel.state.watcher_count);
      setWatchers({ ...channel.state.watchers });
    }
  });

  const handleEvent: EventHandler<At, Ch, Co, Ev, Me, Re, Us> = (event) => {
    if (thread) {
      const updatedThreadMessages =
        (thread.id && channel && channel.state.threads[thread.id]) ||
        threadMessages;
      setThreadMessages(updatedThreadMessages);
    }

    if (channel && thread && event.message?.id === thread.id) {
      const updatedThread = channel.state.formatMessage(event.message);
      setThread(updatedThread);
    }

    if (channel) {
      copyChannelState();
    }
  };

  const listenToChanges = () => {
    // The more complex sync logic is done in Chat.js
    // listen to client.connection.recovered and all channel events
    client.on('connection.recovered', handleEvent);
    channel?.on(handleEvent);
  };

  const channelQueryCall = async (queryCall: () => void = () => null) => {
    setError(false);
    setLoading(true);

    try {
      await queryCall();
      setLastRead(new Date());
      copyChannelState();
      listenToChanges();
    } catch (err) {
      setError(err);
      setLoading(false);
      setLastRead(new Date());
    }
  };

  /**
   * Loads channel at first unread channel.
   */
  const loadChannelAtFirstUnreadMessage = () => {
    if (!channel) return;
    const unreadCount = channel.countUnread();
    if (unreadCount <= scrollToFirstUnreadThreshold) return;

    channel.state.clearMessages();
    channel.state.setIsUpToDate(false);

    return channelQueryCall(async () => {
      /**
       * Stream only keeps unread count of channel upto 255. So once the count of unread messages reaches 255, we stop counting.
       * Thus we need to handle these two cases separately.
       */
      if (unreadCount < globalUnreadCountLimit) {
        /**
         * We want to ensure that first unread message appears in the first window frame, when message list loads.
         * If we assume that we have a exact count of unread messages, then first unread message is at offset = channel.countUnread().
         * So we will query 2 messages after (and including) first unread message, and 30 messages before first unread
         * message. So 2nd message in list is the first unread message. We can safely assume that 2nd message in list
         * will be visible to user when list loads.
         */
        const offset = unreadCount - unreadMessagesOnInitialLoadLimit;
        await query(offset, 30);

        /**
         * If the number of messages are not enough to fill the screen (we are making an assumption here that on overage 4 messages
         * are enough to fill the screen), then we need to fetch some more messages on recent side.
         */
        if (
          channel.state.messages.length &&
          channel.state.messages.length <= scrollToFirstUnreadThreshold &&
          !channel.state.isUpToDate
        ) {
          const mostRecentMessage =
            channel.state.messages[channel.state.messages.length - 1];
          await queryAfterMessage(mostRecentMessage.id, 5);
        }
      } else {
        /**
         * If the unread count is 255, then we don't have exact unread count anymore, to determine the offset for querying messages.
         * In this case we are going to query messages using date params instead of offset-limit e.g., created_at_before_or_equal
         * So we query 30 messages before the last time user read the channel - channel.lastRead()
         */
        await channel.query({
          messages: {
            created_at_before_or_equal: channel.lastRead() || new Date(0),
            limit: 30,
          },
        });

        /**
         * If the number of messages are not enough to fill the screen (we are making an assumption here that on overage 4 messages
         * are enough to fill the screen), then we need to fetch some more messages on recent side.
         */
        if (
          channel.state.messages.length <= unreadMessagesOnInitialLoadLimit &&
          !channel.state.isUpToDate
        ) {
          if (channel.state.messages.length > 0) {
            const mostRecentMessage =
              channel.state.messages[channel.state.messages.length - 1];
            await queryAfterMessage(mostRecentMessage.id, 5);
          } else {
            /**
             * If we didn't get any messages, which means first unread message is the first ever message in channel.
             * So simply fetch some messages after the lastRead datetime.
             * We are keeping the limit as 10 here, as opposed to 30 in cases above. The reason being, we want the list
             * to be scrolled upto first unread message. So in this case we will need the scroll to start at top of the list.
             * React native provides a prop `initialScrollIndex` on FlatList, but it doesn't really work well
             * especially for dynamic sized content. So when the list loads, we are just going to manually scroll
             * to top of the list - flRef.current.scrollToEnd(). This autoscroll behavior is not great in general, but its less
             * bad for scrolling up 10 messages than scrolling up 30 messages.
             */
            await channel.query({
              messages: {
                created_at_after: channel.lastRead() || new Date(0),
                limit: 10,
              },
            });
          }
        }
      }
    });
  };

  /**
   * Loads channel at specific message
   *
   * @param messageId If undefined, channel will be loaded at most recent message.
   * @param before Number of message to query before messageId
   * @param after Number of message to query after messageId
   */
  const loadChannelAtMessage: ChannelContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['loadChannelAtMessage'] = ({ after = 2, before = 30, messageId }) =>
    channelQueryCall(async () => {
      await queryAtMessage({ after, before, messageId });

      if (messageId) {
        setTargetedMessage(messageId);
      }
    });

  const loadChannel = () =>
    channelQueryCall(() => {
      if (!channel?.initialized || !channel.state.isUpToDate) {
        channel?.state.clearMessages();
        return channel?.watch();
      }

      return;
    });

  const reloadChannel = async () =>
    channel ? await loadChannelAtMessage({ before: 30 }) : undefined;

  /**
   * Makes a query to load messages in channel.
   */
  const query = async (offset = 0, limit = 30) => {
    if (!channel) return;
    channel.state.clearMessages();

    await channel.query({
      messages: {
        limit,
        offset,
      },
      watch: true,
    });

    channel.state.setIsUpToDate(offset === 0);
  };

  /**
   * Makes a query to load messages at particular message id.
   *
   * @param messageId Targeted message id
   * @param before Number of messages to load before messageId
   * @param after Number of messages to load after messageId
   */
  const queryAtMessage = async ({
    after = 10,
    before = 10,
    messageId,
  }: Parameters<
    ChannelContextValue<At, Ch, Co, Ev, Me, Re, Us>['loadChannelAtMessage']
  >[0]) => {
    if (!channel) return;
    channel.state.setIsUpToDate(false);
    channel.state.clearMessages();
    setMessages([...channel.state.messages]);
    if (!messageId) {
      await channel.query({
        messages: {
          limit: before,
        },
        watch: true,
      });

      channel.state.setIsUpToDate(true);
      return;
    }

    await queryBeforeMessage(messageId, before);
    await queryAfterMessage(messageId, after);
  };

  /**
   * Makes a query to load messages before particular message id.
   *
   * @param messageId Targeted message id
   * @param limit Number of messages to load
   */
  const queryBeforeMessage = async (messageId: string, limit = 5) => {
    if (!channel) return;

    await channel.query({
      messages: {
        id_lt: messageId,
        limit,
      },
      watch: true,
    });

    channel.state.setIsUpToDate(false);
  };

  /**
   * Makes a query to load messages later than particular message id.
   *
   * @param messageId Targeted message id
   * @param limit Number of messages to load.
   */
  const queryAfterMessage = async (messageId: string, limit = 5) => {
    if (!channel) return;
    const state = await channel.query({
      messages: {
        id_gte: messageId,
        limit,
      },
      watch: true,
    });

    if (state.messages.length < limit) {
      channel.state.setIsUpToDate(true);
    } else {
      channel.state.setIsUpToDate(false);
    }
  };

  /**
   * Channel configs for use in disabling local functionality
   */
  const messagesConfig = {
    reactionsEnabled: true,
    repliesEnabled: true,
  } as MessagesConfig;
  const channelConfig = {
    readEventsEnabled: true,
    typingEventsEnabled: true,
  } as ChannelConfig;
  const inputConfig = {
    maxMessageLength: undefined,
    uploadsEnabled: true,
  } as InputConfig;
  if (typeof channel?.getConfig === 'function') {
    const clientChannelConfig = channel.getConfig();
    const maxMessageLength = clientChannelConfig?.max_message_length;
    const reactions = clientChannelConfig?.reactions;
    const readEvents = clientChannelConfig?.read_events;
    const replies = clientChannelConfig?.replies;
    const typingEvents = clientChannelConfig?.typing_events;
    const uploads = clientChannelConfig?.uploads;
    channelConfig.readEventsEnabled = readEvents;
    channelConfig.typingEventsEnabled = typingEvents;
    inputConfig.maxMessageLength = maxMessageLength;
    inputConfig.uploadsEnabled = uploads;
    messagesConfig.reactionsEnabled = reactions;
    messagesConfig.repliesEnabled = replies;
  }

  /**
   * MESSAGE METHODS
   */

  const updateMessage: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['updateMessage'] = (updatedMessage, extraState = {}) => {
    if (channel) {
      channel.state.addMessageSorted(updatedMessage, true);
      if (thread && updatedMessage.parent_id) {
        extraState.threadMessages =
          { ...channel.state.threads }[updatedMessage.parent_id] || [];
        setThreadMessages(extraState.threadMessages);
      }

      setMessages([...channel.state.messages]);
    }
  };

  const createMessagePreview = ({
    attachments,
    mentioned_users,
    parent_id,
    text,
    ...extraFields
  }: Partial<StreamMessage<At, Me, Us>>) => {
    const preview = ({
      __html: text,
      attachments,
      created_at: new Date(),
      html: text,
      id: `${client.userID}-${generateRandomId()}`,
      mentioned_users:
        mentioned_users?.map((userId) => ({
          id: userId,
        })) || [],
      parent_id,
      reactions: [],
      status: 'sending',
      text,
      type: 'regular',
      user: {
        id: client.userID,
        ...client.user,
      },
      ...extraFields,
    } as unknown) as MessageResponse<At, Ch, Co, Me, Re, Us>;

    /**
     * This is added to the message for local rendering prior to the message
     * being returned from the backend, it is removed when the message is sent
     * as quoted_message is a reserved field.
     */
    if (preview.quoted_message_id) {
      const quotedMessage = messages.find(
        (message) => message.id === preview.quoted_message_id,
      );

      preview.quoted_message = quotedMessage as MessageResponse<
        At,
        Ch,
        Co,
        Me,
        Re,
        Us
      >['quoted_message'];
    }
    return preview;
  };

  const sendMessageRequest = async (
    message: MessageResponse<At, Ch, Co, Me, Re, Us>,
  ) => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      __html,
      attachments,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      created_at,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      html,
      id,
      mentioned_users,
      parent_id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      quoted_message,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      reactions,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      status,
      text,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      user,
      ...extraFields
    } = message;

    const messageData = {
      attachments,
      id,
      mentioned_users:
        mentioned_users?.map((mentionedUser) => mentionedUser.id) || [],
      parent_id,
      text,
      ...extraFields,
    } as StreamMessage<At, Me, Us>;

    try {
      let messageResponse = {} as SendMessageAPIResponse<
        At,
        Ch,
        Co,
        Me,
        Re,
        Us
      >;

      if (doSendMessageRequest) {
        messageResponse = await doSendMessageRequest(
          channel?.cid || '',
          messageData,
        );
      } else if (channel) {
        messageResponse = await channel.sendMessage(messageData);
      }

      if (messageResponse.message) {
        messageResponse.message.status = 'received';
        updateMessage(messageResponse.message);
      }
    } catch (err) {
      console.log(err);
      message.status = 'failed';
      updateMessage(message);
    }
  };

  const sendMessage: InputMessageInputContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['sendMessage'] = async (message) => {
    if (channel?.state?.filterErrorMessages) {
      channel.state.filterErrorMessages();
    }

    const messagePreview = createMessagePreview({
      ...message,
      attachments: message.attachments || [],
    });

    if (!channel?.state.isUpToDate) {
      await reloadChannel();
    }

    updateMessage(messagePreview, {
      commands: [],
      messageInput: '',
    });

    await sendMessageRequest(messagePreview);
  };

  const retrySendMessage: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['retrySendMessage'] = async (message) => {
    message = { ...message, status: 'sending' };
    updateMessage(message);
    await sendMessageRequest(message);
  };

  // hard limit to prevent you from scrolling faster than 1 page per 2 seconds
  const loadMoreFinished = heavyDebounce(
    (
      updatedHasMore: boolean,
      newMessages: ChannelState<At, Ch, Co, Ev, Me, Re, Us>['messages'],
    ) => {
      setLoadingMore(false);
      setHasMore(updatedHasMore);
      setMessages(newMessages);
    },
  );

  const loadMore: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['loadMore'] = heavyThrottle(async () => {
    if (loadingMoreRecent || loadingMore || hasMore === false) return;
    setLoadingMore(true);

    if (!messages.length) {
      return setLoadingMore(false);
    }

    const oldestMessage = messages && messages[0];

    if (oldestMessage && oldestMessage.status !== 'received') {
      return setLoadingMore(false);
    }

    const oldestID = oldestMessage && oldestMessage.id;
    const limit = 20;

    try {
      if (channel) {
        const queryResponse = await channel.query({
          messages: { id_lt: oldestID, limit },
        });

        const updatedHasMore = queryResponse.messages.length === limit;
        loadMoreFinished(updatedHasMore, [...channel.state.messages]);
      }
    } catch (err) {
      console.warn('Message pagination request failed with error', err);
      return setLoadingMore(false);
    }
  });

  const loadMoreRecent: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['loadMoreRecent'] = heavyThrottle(async () => {
    if (
      loadingMore ||
      loadingMoreRecent ||
      channel?.state.isUpToDate ||
      !messages.length
    ) {
      return;
    }

    setLoadingMoreRecent(true);

    const recentMessage = messages[messages.length - 1];

    if (recentMessage?.status !== 'received') {
      setLoadingMoreRecent(false);
      return;
    }

    try {
      if (channel) {
        await queryAfterMessage(recentMessage.id);
        loadMoreRecentFinished([...channel.state.messages]);
      }
    } catch (err) {
      console.warn('Message pagination request failed with error', err);
      setLoadingMoreRecent(false);
      return;
    }
  });

  // hard limit to prevent you from scrolling faster than 1 page per 2 seconds
  const loadMoreRecentFinished = heavyDebounce(
    (newMessages: ChannelState<At, Ch, Co, Ev, Me, Re, Us>['messages']) => {
      setLoadingMoreRecent(false);
      setMessages(newMessages);
    },
  );

  const editMessage: InputMessageInputContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['editMessage'] = (updatedMessage) =>
    doUpdateMessageRequest
      ? doUpdateMessageRequest(channel?.cid || '', updatedMessage)
      : client.updateMessage(updatedMessage);

  const setEditingState: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['setEditingState'] = (message) => {
    setEditing(message);
  };

  const setQuotedMessageState: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['setQuotedMessageState'] = (message) => {
    setQuotedMessage(message);
  };

  const clearEditingState: InputMessageInputContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['clearEditingState'] = () => setEditing(false);

  const clearQuotedMessageState: InputMessageInputContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['clearQuotedMessageState'] = () => setQuotedMessage(false);

  const removeMessage: MessagesContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['removeMessage'] = (message) => {
    if (channel) {
      channel.state.removeMessage(message);
      setMessages([...channel.state.messages]);
    }
  };

  /**
   * THREAD METHODS
   */
  const openThread: ThreadContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['openThread'] = (message) => {
    const newThreadMessages = message?.id
      ? channel?.state?.threads[message.id] || []
      : [];
    setThread(message);
    setThreadMessages(newThreadMessages);
  };

  const closeThread: ThreadContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['closeThread'] = useCallback(() => {
    setThread(null);
    setThreadMessages([]);
  }, [setThread, setThreadMessages]);

  // hard limit to prevent you from scrolling faster than 1 page per 2 seconds
  const loadMoreThreadFinished = heavyDebounce(
    (
      newThreadHasMore: boolean,
      updatedThreadMessages: ChannelState<
        At,
        Ch,
        Co,
        Ev,
        Me,
        Re,
        Us
      >['threads'][string],
    ) => {
      setThreadHasMore(newThreadHasMore);
      setThreadLoadingMore(false);
      setThreadMessages(updatedThreadMessages);
    },
  );

  const loadMoreThread: ThreadContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >['loadMoreThread'] = async () => {
    if (threadLoadingMore || !thread?.id) return;
    setThreadLoadingMore(true);

    if (channel) {
      const parentID = thread.id;

      const oldMessages = channel.state.threads[parentID] || [];
      const oldestMessageID = oldMessages?.[0]?.id;

      const limit = 50;
      const queryResponse = await channel.getReplies(parentID, {
        id_lt: oldestMessageID,
        limit,
      });

      const updatedHasMore = queryResponse.messages.length === limit;
      const updatedThreadMessages = channel.state.threads[parentID] || [];
      loadMoreThreadFinished(updatedHasMore, updatedThreadMessages);
    }
  };

  const channelContext = useCreateChannelContext({
    ...channelConfig,
    channel,
    disabled: !!channel?.data?.frozen && disableIfFrozenChannel,
    EmptyStateIndicator,
    enforceUniqueReaction,
    error,
    giphyEnabled:
      giphyEnabled ??
      !!(channel?.getConfig?.()?.commands || [])?.some(
        (command) => command.name === 'giphy',
      ),
    isAdmin,
    isModerator,
    isOwner,
    lastRead,
    loadChannelAtMessage,
    loading,
    LoadingIndicator,
    markRead,
    members,
    read,
    reloadChannel,
    scrollToFirstUnreadThreshold,
    setLastRead,
    setTargetedMessage,
    StickyHeader,
    targetedMessage,
    typing,
    watcherCount,
    watchers,
  });

  const messageInputContext = useCreateInputMessageInputContext({
    ...inputConfig,
    additionalTextInputProps,
    AttachButton,
    clearEditingState,
    clearQuotedMessageState,
    CommandsButton,
    compressImageQuality,
    doDocUploadRequest,
    doImageUploadRequest,
    editing,
    editMessage,
    FileUploadPreview,
    hasFilePicker,
    hasImagePicker,
    ImageUploadPreview,
    initialValue,
    Input,
    maxNumberOfFiles,
    MoreOptionsButton,
    numberOfLines,
    onChangeText,
    quotedMessage,
    SendButton,
    sendImageAsync,
    sendMessage,
    setInputRef,
    ShowThreadMessageInChannelButton,
    UploadProgressIndicator,
  });

  const messagesContext = useCreateMessagesContext({
    ...messagesConfig,
    additionalTouchableProps,
    Attachment,
    AttachmentActions,
    AttachmentFileIcon,
    Card,
    CardCover,
    CardFooter,
    CardHeader,
    DateHeader,
    disableTypingIndicator,
    dismissKeyboardOnMessageTouch,
    FileAttachment,
    FileAttachmentGroup,
    FlatList,
    formatDate,
    Gallery,
    Giphy,
    hasMore,
    initialScrollToFirstUnreadMessage,
    InlineUnreadIndicator,
    loadingMore,
    loadingMoreRecent,
    loadMore,
    loadMoreRecent,
    markdownRules,
    Message,
    MessageAvatar,
    MessageContent,
    messageContentOrder,
    MessageFooter,
    MessageHeader,
    MessageList,
    MessageReplies,
    MessageRepliesAvatars,
    messages,
    MessageSimple,
    MessageStatus,
    MessageSystem,
    MessageText,
    myMessageTheme,
    onDoubleTapMessage,
    ReactionList,
    removeMessage,
    Reply,
    retrySendMessage,
    ScrollToBottomButton,
    setEditingState,
    setQuotedMessageState,
    supportedReactions,
    TypingIndicator,
    TypingIndicatorContainer,
    updateMessage,
    UrlPreview,
  });

  const suggestionsContext: Partial<SuggestionsContextValue<Co, Us>> = {
    closeSuggestions,
    openSuggestions,
    updateSuggestions,
  };

  const threadContext = useCreateThreadContext({
    allowThreadMessagesInChannel,
    closeThread,
    loadMoreThread,
    openThread,
    thread,
    threadHasMore,
    threadLoadingMore,
    threadMessages,
  });

  if (!channel || error) {
    return (
      <LoadingErrorIndicator
        error={error}
        listType='message'
        retry={() => {
          loadMore();
        }}
      />
    );
  }

  if (!channel?.cid || !channel.watch) {
    return (
      <Text
        style={[styles.selectChannel, { color: black }, selectChannel]}
        testID='no-channel'
      >
        {t('Please select a channel first')}
      </Text>
    );
  }

  return (
    <KeyboardCompatibleView
      behavior={keyboardBehavior}
      enabled={!disableKeyboardCompatibleView}
      keyboardVerticalOffset={keyboardVerticalOffset}
      {...additionalKeyboardAvoidingViewProps}
    >
      <ChannelProvider<At, Ch, Co, Ev, Me, Re, Us> value={channelContext}>
        <MessagesProvider<At, Ch, Co, Ev, Me, Re, Us> value={messagesContext}>
          <ThreadProvider<At, Ch, Co, Ev, Me, Re, Us> value={threadContext}>
            <SuggestionsProvider<Co, Us> value={suggestionsContext}>
              <MessageInputProvider<At, Ch, Co, Ev, Me, Re, Us>
                value={messageInputContext}
              >
                <View style={{ height: '100%' }}>{children}</View>
              </MessageInputProvider>
            </SuggestionsProvider>
          </ThreadProvider>
        </MessagesProvider>
      </ChannelProvider>
    </KeyboardCompatibleView>
  );
};

export type ChannelProps<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = Partial<ChannelPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>>;

/**
 *
 * The wrapper component for a chat channel. Channel needs to be placed inside a Chat component
 * to receive the StreamChat client instance. MessageList, Thread, and MessageInput must be
 * children of the Channel component to receive the ChannelContext.
 *
 * @example ./Channel.md
 */
export const Channel = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: PropsWithChildren<ChannelProps<At, Ch, Co, Ev, Me, Re, Us>>,
) => {
  const { client } = useChatContext<At, Ch, Co, Ev, Me, Re, Us>();
  const { t } = useTranslationContext();

  return (
    <ChannelWithContext<At, Ch, Co, Ev, Me, Re, Us>
      {...{
        client,
        t,
      }}
      {...props}
    />
  );
};

Channel.displayName = 'Channel{channel}';
