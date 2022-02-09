import React, { PropsWithChildren, useContext } from 'react';

import type { TouchableOpacityProps } from 'react-native';

import type { MessagePinnedHeaderProps } from 'src/components/Message/MessageSimple/MessagePinnedHeader';

import type { ChannelState, MessageResponse } from 'stream-chat';

import type { AttachmentProps } from '../../components/Attachment/Attachment';
import type { AttachmentActionsProps } from '../../components/Attachment/AttachmentActions';
import type { CardProps } from '../../components/Attachment/Card';
import type { FileAttachmentProps } from '../../components/Attachment/FileAttachment';
import type { FileAttachmentGroupProps } from '../../components/Attachment/FileAttachmentGroup';
import type { FileIconProps } from '../../components/Attachment/FileIcon';
import type { GalleryProps } from '../../components/Attachment/Gallery';
import type { GiphyProps } from '../../components/Attachment/Giphy';
import type {
  MessageProps,
  MessageTouchableHandlerPayload,
} from '../../components/Message/Message';
import type { MessageAvatarProps } from '../../components/Message/MessageSimple/MessageAvatar';
import type { MessageContentProps } from '../../components/Message/MessageSimple/MessageContent';
import type { MessageDeletedProps } from '../../components/Message/MessageSimple/MessageDeleted';
import type { MessageFooterProps } from '../../components/Message/MessageSimple/MessageFooter';

import type { MessageRepliesProps } from '../../components/Message/MessageSimple/MessageReplies';
import type { MessageRepliesAvatarsProps } from '../../components/Message/MessageSimple/MessageRepliesAvatars';
import type { MessageSimpleProps } from '../../components/Message/MessageSimple/MessageSimple';
import type { MessageStatusProps } from '../../components/Message/MessageSimple/MessageStatus';
import type { MessageTextProps } from '../../components/Message/MessageSimple/MessageTextContainer';
import type { ReactionListProps } from '../../components/Message/MessageSimple/ReactionList';
import type { MarkdownRules } from '../../components/Message/MessageSimple/utils/renderText';
import type { MessageActionsParams } from '../../components/Message/utils/messageActions';
import type { DateHeaderProps } from '../../components/MessageList/DateHeader';
import type { MessageType } from '../../components/MessageList/hooks/useMessageList';
import type { InlineDateSeparatorProps } from '../../components/MessageList/InlineDateSeparator';
import type { MessageListProps } from '../../components/MessageList/MessageList';
import type { MessageSystemProps } from '../../components/MessageList/MessageSystem';
import type { ScrollToBottomButtonProps } from '../../components/MessageList/ScrollToBottomButton';
import type { MessageActionType } from '../../components/MessageOverlay/MessageActionListItem';
import type { OverlayReactionListProps } from '../../components/MessageOverlay/OverlayReactionList';
import type { ReplyProps } from '../../components/Reply/Reply';
import type { FlatList } from '../../native';
import type { DefaultStreamChatGenerics, UnknownType } from '../../types/types';
import type { ReactionData } from '../../utils/utils';
import type { Alignment } from '../messageContext/MessageContext';
import type { SuggestionCommand } from '../suggestionsContext/SuggestionsContext';
import type { DeepPartial } from '../themeContext/ThemeContext';
import type { Theme } from '../themeContext/utils/theme';
import type { TDateTimeParserInput } from '../translationContext/TranslationContext';
import { getDisplayName } from '../utils/getDisplayName';

export type MessageContentType = 'attachments' | 'files' | 'gallery' | 'quoted_reply' | 'text';

export type MessagesContextValue<
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
> = {
  /**
   * UI component for Attachment.
   * Defaults to: [Attachment](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/Attachment.tsx)
   */
  Attachment: React.ComponentType<AttachmentProps<StreamChatClient>>;
  /**
   * UI component to display AttachmentActions. e.g., send, shuffle, cancel in case of giphy
   * Defaults to: [AttachmentActions](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/AttachmentActions.tsx)
   */
  AttachmentActions: React.ComponentType<AttachmentActionsProps<StreamChatClient>>;
  /**
   * UI component to display generic media type e.g. giphy, url preview etc
   * Defaults to: [Card](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/Card.tsx)
   */
  Card: React.ComponentType<CardProps<StreamChatClient>>;
  /**
   * UI component for DateHeader
   * Defaults to: [DateHeader](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/MessageList/DateHeader.tsx)
   **/
  DateHeader: React.ComponentType<DateHeaderProps>;

  /** Should keyboard be dismissed when messaged is touched */
  dismissKeyboardOnMessageTouch: boolean;

  enableMessageGroupingByUser: boolean;

  /**
   * UI component to display File type attachment.
   * Defaults to: [FileAttachment](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/FileAttachment.tsx)
   */
  FileAttachment: React.ComponentType<FileAttachmentProps<StreamChatClient>>;
  /**
   * UI component to display group of File type attachments or multiple file attachments (in single message).
   * Defaults to: [FileAttachmentGroup](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/FileAttachmentGroup.tsx)
   */
  FileAttachmentGroup: React.ComponentType<FileAttachmentGroupProps<StreamChatClient>>;
  /**
   * UI component for attachment icon for type 'file' attachment.
   * Defaults to: https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/FileIcon.tsx
   */
  FileAttachmentIcon: React.ComponentType<FileIconProps>;
  FlatList: typeof FlatList;
  /**
   * UI component to display image attachments
   * Defaults to: [Gallery](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/Gallery.tsx)
   */
  Gallery: React.ComponentType<GalleryProps<StreamChatClient>>;
  /**
   * UI component for Giphy
   * Defaults to: [Giphy](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/Giphy.tsx)
   */
  Giphy: React.ComponentType<GiphyProps<StreamChatClient>>;

  /**
   * When true, messageList will be scrolled at first unread message, when opened.
   */
  initialScrollToFirstUnreadMessage: boolean;
  /**
   * UI component for Message Date Separator Component
   * Defaults to: [InlineDateSeparator](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/MessageList/InlineDateSeparator.tsx)
   */
  InlineDateSeparator: React.ComponentType<InlineDateSeparatorProps>;
  /**
   * UI component for InlineUnreadIndicator
   * Defaults to: [InlineUnreadIndicator](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Message/MessageSimple/InlineUnreadIndicator.tsx)
   **/
  InlineUnreadIndicator: React.ComponentType;
  Message: React.ComponentType<MessageProps<StreamChatClient>>;
  /**
   * UI component for MessageAvatar
   * Defaults to: [MessageAvatar](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Message/MessageSimple/MessageAvatar.tsx)
   **/
  MessageAvatar: React.ComponentType<MessageAvatarProps<StreamChatClient>>;
  /**
   * UI component for MessageContent
   * Defaults to: [MessageContent](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Message/MessageSimple/MessageContent.tsx)
   */
  MessageContent: React.ComponentType<MessageContentProps<StreamChatClient>>;
  /** Order to render the message content */
  messageContentOrder: MessageContentType[];
  /**
   * UI component for MessageDeleted
   * Defaults to: [MessageDeleted](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/MessageSimple/MessageDeleted.tsx)
   */
  MessageDeleted: React.ComponentType<MessageDeletedProps<StreamChatClient>>;
  /**
   * Custom message footer component
   */
  MessageFooter: React.ComponentType<MessageFooterProps<StreamChatClient>>;
  MessageList: React.ComponentType<MessageListProps<StreamChatClient>>;
  /**
   * Custom message pinned component
   */
  MessagePinnedHeader: React.ComponentType<MessagePinnedHeaderProps<StreamChatClient>>;
  /**
   * UI component for MessageReplies
   * Defaults to: [MessageReplies](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/MessageSimple/MessageReplies.tsx)
   */

  MessageReplies: React.ComponentType<MessageRepliesProps<StreamChatClient>>;
  /**
   * UI Component for MessageRepliesAvatars
   * Defaults to: [MessageRepliesAvatars](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/MessageSimple/MessageRepliesAvatars.tsx)
   */
  MessageRepliesAvatars: React.ComponentType<MessageRepliesAvatarsProps<StreamChatClient>>;
  /**
   * UI component for MessageSimple
   * Defaults to: [MessageSimple](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Message/MessageSimple/MessageSimple.tsx)
   */
  MessageSimple: React.ComponentType<MessageSimpleProps<StreamChatClient>>;
  /**
   * UI component for MessageStatus (delivered/read)
   * Defaults to: [MessageStatus](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Message/MessageSimple/MessageStatus.tsx)
   */
  MessageStatus: React.ComponentType<MessageStatusProps<StreamChatClient>>;
  /**
   * UI component for MessageSystem
   * Defaults to: [MessageSystem](https://getstream.github.io/stream-chat-react-native/v3/#messagesystem)
   */
  MessageSystem: React.ComponentType<MessageSystemProps<StreamChatClient>>;
  /**
   * UI component for OverlayReactionList
   */
  OverlayReactionList: React.ComponentType<OverlayReactionListProps<StreamChatClient>>;
  /**
   * UI component for ReactionList
   * Defaults to: [ReactionList](https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Reaction/ReactionList.tsx)
   */
  ReactionList: React.ComponentType<ReactionListProps<StreamChatClient>>;
  removeMessage: (message: { id: string; parent_id?: string }) => void;
  /**
   * UI component for Reply
   * Defaults to: [Reply](https://getstream.github.io/stream-chat-react-native/v3/#reply)
   */
  Reply: React.ComponentType<ReplyProps<StreamChatClient>>;
  /**
   * Override the api request for retry message functionality.
   */
  retrySendMessage: (message: MessageResponse<StreamChatClient>) => Promise<void>;
  /**
   * UI component for ScrollToBottomButton
   * Defaults to: [ScrollToBottomButton](https://getstream.github.io/stream-chat-react-native/v3/#ScrollToBottomButton)
   */
  ScrollToBottomButton: React.ComponentType<ScrollToBottomButtonProps>;
  setEditingState: (message: MessageType<StreamChatClient>) => void;
  setQuotedMessageState: (message: MessageType<StreamChatClient>) => void;
  supportedReactions: ReactionData[];
  /**
   * UI component for TypingIndicator
   * Defaults to: [TypingIndicator](https://getstream.github.io/stream-chat-react-native/v3/#typingindicator)
   */
  TypingIndicator: React.ComponentType;
  /**
   * UI component for TypingIndicatorContainer
   * Defaults to: [TypingIndicatorContainer](https://getstream.github.io/stream-chat-react-native/v3/#typingindicatorcontainer)
   */
  TypingIndicatorContainer: React.ComponentType;
  updateMessage: (
    updatedMessage: MessageResponse<StreamChatClient>,
    extraState?: {
      commands?: SuggestionCommand<StreamChatClient>[];
      messageInput?: string;
      threadMessages?: ChannelState<StreamChatClient>['threads'][string];
    },
  ) => void;
  /**
   * Custom UI component to display enriched url preview.
   * Defaults to https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/Attachment/Card.tsx
   */
  UrlPreview: React.ComponentType<CardProps<StreamChatClient>>;
  /**
   * Provide any additional props for `TouchableOpacity` which wraps inner MessageContent component here.
   * Please check docs for TouchableOpacity for supported props - https://reactnative.dev/docs/touchableopacity#props
   *
   * @overrideType Object
   */
  additionalTouchableProps?: Omit<TouchableOpacityProps, 'style'>;
  /**
   * Custom UI component to override default cover (between Header and Footer) of Card component.
   * Accepts the same props as Card component.
   */
  CardCover?: React.ComponentType<CardProps<StreamChatClient>>;
  /**
   * Custom UI component to override default Footer of Card component.
   * Accepts the same props as Card component.
   */
  CardFooter?: React.ComponentType<CardProps<StreamChatClient>>;
  /**
   * Custom UI component to override default header of Card component.
   * Accepts the same props as Card component.
   */
  CardHeader?: React.ComponentType<CardProps<StreamChatClient>>;

  /**
   * Full override of the delete message button in the Message Actions
   *
   * Please check [cookbook](https://github.com/GetStream/stream-chat-react-native/wiki/Cookbook-v3.0#override-or-intercept-message-actions-edit-delete-reaction-reply-etc) for details.
   */

  /** Control if the deleted message is visible to both the send and reciever, either of them or none  */
  deletedMessagesVisibilityType?: 'always' | 'never' | 'receiver' | 'sender';

  disableTypingIndicator?: boolean;

  /**
   * Whether messages should be aligned to right or left part of screen.
   * By default, messages will be received messages will be aligned to left and
   * sent messages will be aligned to right.
   */
  forceAlignMessages?: Alignment | boolean;
  /**
   * Optional function to custom format the message date
   */
  formatDate?: (date: TDateTimeParserInput) => string;
  handleBlock?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to access when a copy message action is invoked */
  handleCopy?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to access when a delete message action is invoked */
  handleDelete?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to access when an edit message action is invoked */
  handleEdit?: (message: MessageType<StreamChatClient>) => void;
  /** Handler to access when a flag message action is invoked */
  handleFlag?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to access when a mute user action is invoked */
  handleMute?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to access when a pin/unpin user action is invoked*/
  handlePinMessage?: ((message: MessageType<StreamChatClient>) => MessageActionType) | null;
  /** Handler to access when a quoted reply action is invoked */
  handleQuotedReply?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to process a reaction */
  handleReaction?: (message: MessageType<StreamChatClient>, reactionType: string) => Promise<void>;
  /** Handler to access when a retry action is invoked */
  handleRetry?: (message: MessageType<StreamChatClient>) => Promise<void>;
  /** Handler to access when a thread reply action is invoked */
  handleThreadReply?: (message: MessageType<StreamChatClient>) => Promise<void>;
  legacyImageViewerSwipeBehaviour?: boolean;
  /** Object specifying rules defined within simple-markdown https://github.com/Khan/simple-markdown#adding-a-simple-extension */
  markdownRules?: MarkdownRules;
  /**
   * Use this prop to override message actions (which pop-up in message overlay).
   *
   * You can either completely override the default messageActions object.
   *
   * ```
   * <Channel
   *   messageActions=[
   *     {
   *       action: () => { someAction() };
   *       title: "Pin Message";
   *       icon: PinIcon;
   *       titleStyle: {};
   *     },
   *     {
   *       action: () => { someAction() };
   *       title: "Delete Message";
   *       icon: PinIcon;
   *       titleStyle: {};
   *     }
   *   ]
   * >
   * </Channel>
   * ```
   *
   * Or you can selectly keep certain action and remove some:
   *
   * e.g. Lets say you only want to keep threadReply and copyMessage actions
   *
   * ```
   * <Channel
   *   messageActions={({
   *     blockUser,
   *     copyMessage,
   *     deleteMessage,
   *     editMessage,
   *     flagMessage,
   *     muteUser,
   *     quotedReply,
   *     retry,
   *     threadReply,
   *   }) => ([
   *     threadReply, copyMessage
   *   ])}
   * >
   *  </Channel>
   *  ```
   *
   * @overrideType Function | Array<Objects>
   */
  messageActions?: (param: MessageActionsParams<StreamChatClient>) => MessageActionType[];
  /**
   * Custom message header component
   */
  MessageHeader?: React.ComponentType<MessageFooterProps<StreamChatClient>>;
  /** Custom UI component for message text */
  MessageText?: React.ComponentType<MessageTextProps<StreamChatClient>>;

  /**
   * Theme provided only to messages that are the current users
   */
  myMessageTheme?: DeepPartial<Theme>;
  /**
   * Override default handler for onLongPress on message. You have access to payload of that handler as param:
   *
   * ```
   * <Channel
   *  onLongPressMessage={({
   *    actionHandlers: {
   *        deleteMessage, // () => Promise<void>;
   *        editMessage, // () => void;
   *        quotedReply, // () => void;
   *        resendMessage, // () => Promise<void>;
   *        showMessageOverlay, // () => void;
   *        toggleBanUser, // () => Promise<void>;
   *        toggleMuteUser, // () => Promise<void>;
   *        toggleReaction, // (reactionType: string) => Promise<void>;
   *    },
   *    defaultHandler, // () => void
   *    event, // any event object corresponding to touchable feedback
   *    emitter, // which component trigged this touchable feedback e.g. card, fileAttachment, gallery, message ... etc
   *    message // message object on which longPress occured
   *  }) => {
   *    // Your custom action
   *  }}
   * />
   * ```
   */
  onLongPressMessage?: (payload: MessageTouchableHandlerPayload<StreamChatClient>) => void;
  /**
   * Add onPressIn handler for attachments. You have access to payload of that handler as param:
   *
   * ```
   * <Channel
   *  onPressInMessage={({
   *    actionHandlers: {
   *        deleteMessage, // () => Promise<void>;
   *        editMessage, // () => void;
   *        quotedReply, // () => void;
   *        resendMessage, // () => Promise<void>;
   *        showMessageOverlay, // () => void;
   *        toggleBanUser, // () => Promise<void>;
   *        toggleMuteUser, // () => Promise<void>;
   *        toggleReaction, // (reactionType: string) => Promise<void>;
   *    },
   *    defaultHandler, // () => void
   *    event, // any event object corresponding to touchable feedback
   *    emitter, // which component trigged this touchable feedback e.g. card, fileAttachment, gallery, message ... etc
   *    message // message object on which longPress occured
   *  }) => {
   *    // Your custom action
   *  }}
   * />
   * ```
   */
  onPressInMessage?: (payload: MessageTouchableHandlerPayload<StreamChatClient>) => void;
  /**
   * Override onPress handler for message. You have access to payload of that handler as param:
   *
   * ```
   * <Channel
   *  onPressMessage={({
   *    actionHandlers: {
   *        deleteMessage, // () => Promise<void>;
   *        editMessage, // () => void;
   *        quotedReply, // () => void;
   *        resendMessage, // () => Promise<void>;
   *        showMessageOverlay, // () => void;
   *        toggleBanUser, // () => Promise<void>;
   *        toggleMuteUser, // () => Promise<void>;
   *        toggleReaction, // (reactionType: string) => Promise<void>;
   *    },
   *    defaultHandler, // () => void
   *    event, // any event object corresponding to touchable feedback
   *    emitter, // which component trigged this touchable feedback e.g. card, fileAttachment, gallery, message ... etc
   *    message // message object on which longPress occurred
   *  }) => {
   *    // Your custom action
   *  }}
   * />
   * ```
   */
  onPressMessage?: (payload: MessageTouchableHandlerPayload<StreamChatClient>) => void;

  /**
   * Full override of the reaction function on Message and Message Overlay
   *
   * Please check [cookbook](https://github.com/GetStream/stream-chat-react-native/wiki/Cookbook-v3.0#override-or-intercept-message-actions-edit-delete-reaction-reply-etc) for details.
   * */
  selectReaction?: (
    message: MessageType<StreamChatClient>,
  ) => (reactionType: string) => Promise<void>;

  targetedMessage?: string;
};

export const MessagesContext = React.createContext({} as MessagesContextValue);

export const MessagesProvider = <
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>({
  children,
  value,
}: PropsWithChildren<{
  value?: MessagesContextValue<StreamChatClient>;
}>) => (
  <MessagesContext.Provider value={value as unknown as MessagesContextValue}>
    {children}
  </MessagesContext.Provider>
);

export const useMessagesContext = <
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>() => useContext(MessagesContext) as unknown as MessagesContextValue<StreamChatClient>;

/**
 * Typescript currently does not support partial inference so if MessagesContext
 * typing is desired while using the HOC withMessagesContext the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withMessagesContext = <
  P extends UnknownType,
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  Component: React.ComponentType<P>,
): React.FC<Omit<P, keyof MessagesContextValue<StreamChatClient>>> => {
  const WithMessagesContextComponent = (
    props: Omit<P, keyof MessagesContextValue<StreamChatClient>>,
  ) => {
    const messagesContext = useMessagesContext<StreamChatClient>();

    return <Component {...(props as P)} {...messagesContext} />;
  };
  WithMessagesContextComponent.displayName = `WithMessagesContext${getDisplayName(Component)}`;
  return WithMessagesContextComponent;
};
