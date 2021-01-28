import React, { PropsWithChildren, useContext, useState } from 'react';

import { getDisplayName } from '../utils/getDisplayName';

import type { StyleProp, TextStyle } from 'react-native';
import type { Attachment } from 'stream-chat';

import type { Alignment } from '../messageContext/MessageContext';
import type {
  GroupType,
  MessagesContextValue,
} from '../messagesContext/MessagesContext';

import type { MessageType } from '../../components/MessageList/hooks/useMessageList';
import type { MessageActionsProps } from '../../components/MessageOverlay/MessageActions';
import type { OverlayReactionListProps } from '../../components/MessageOverlay/OverlayReactionList';
import type { OverlayReactionsProps } from '../../components/MessageOverlay/OverlayReactions';
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

export type MessageAction = {
  action: () => void;
  title: string;
  icon?: React.ReactElement;
  titleStyle?: StyleProp<TextStyle>;
};

export type MessageOverlayData<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = {
  alignment?: Alignment;
  clientId?: string;
  files?: Attachment<At>[];
  groupStyles?: GroupType[];
  handleReaction?: (reactionType: string) => Promise<void>;
  images?: Attachment<At>[];
  message?: MessageType<At, Ch, Co, Ev, Me, Re, Us>;
  messageActions?: MessageAction[];
  messageReactionTitle?: string;
  messagesContext?: MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us>;
  onlyEmojis?: boolean;
  otherAttachments?: Attachment<At>[];
  threadList?: boolean;
};

export type MessageOverlayContextValue<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = {
  MessageActions: React.ComponentType<
    MessageActionsProps<At, Ch, Co, Ev, Me, Re, Us>
  >;
  OverlayReactionList: React.ComponentType<
    OverlayReactionListProps<At, Ch, Co, Ev, Me, Re, Us>
  >;
  OverlayReactions: React.ComponentType<OverlayReactionsProps>;
  reset: () => void;
  setData: React.Dispatch<
    React.SetStateAction<MessageOverlayData<At, Ch, Co, Ev, Me, Re, Us>>
  >;
  data?: MessageOverlayData<At, Ch, Co, Ev, Me, Re, Us>;
};

export const MessageOverlayContext = React.createContext(
  {} as MessageOverlayContextValue,
);

export const MessageOverlayProvider = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>({
  children,
  value,
}: PropsWithChildren<{
  value?: MessageOverlayContextValue<At, Ch, Co, Ev, Me, Re, Us>;
}>) => {
  const [data, setData] = useState(value?.data);

  const reset = () => {
    setData(value?.data);
  };

  const messageOverlayContext = {
    data,
    reset,
    setData,
  };
  return (
    <MessageOverlayContext.Provider
      value={messageOverlayContext as MessageOverlayContextValue}
    >
      {children}
    </MessageOverlayContext.Provider>
  );
};

export const useMessageOverlayContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>() =>
  (useContext(MessageOverlayContext) as unknown) as MessageOverlayContextValue<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >;

/**
 * Typescript currently does not support partial inference so if MessageOverlayContext
 * typing is desired while using the HOC withMessageOverlayContextContext the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withMessageOverlayContext = <
  P extends UnknownType,
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  Component: React.ComponentType<P>,
): React.FC<
  Omit<P, keyof MessageOverlayContextValue<At, Ch, Co, Ev, Me, Re, Us>>
> => {
  const WithMessageOverlayContextComponent = (
    props: Omit<
      P,
      keyof MessageOverlayContextValue<At, Ch, Co, Ev, Me, Re, Us>
    >,
  ) => {
    const messageContext = useMessageOverlayContext<
      At,
      Ch,
      Co,
      Ev,
      Me,
      Re,
      Us
    >();

    return <Component {...(props as P)} {...messageContext} />;
  };
  WithMessageOverlayContextComponent.displayName = `WithMessageOverlayContext${getDisplayName(
    Component,
  )}`;
  return WithMessageOverlayContextComponent;
};
