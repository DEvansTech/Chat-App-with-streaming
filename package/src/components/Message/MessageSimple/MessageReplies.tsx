import React from 'react';
import { ColorValue, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import type { ExtendableGenerics } from 'stream-chat';

import {
  MessageContextValue,
  useMessageContext,
} from '../../../contexts/messageContext/MessageContext';
import {
  MessagesContextValue,
  useMessagesContext,
} from '../../../contexts/messagesContext/MessagesContext';
import { useTheme } from '../../../contexts/themeContext/ThemeContext';
import {
  TranslationContextValue,
  useTranslationContext,
} from '../../../contexts/translationContext/TranslationContext';

import type { DefaultStreamChatGenerics } from '../../../types/types';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  curveContainer: {
    flexDirection: 'row',
  },
  leftMessageRepliesCurve: {
    borderBottomLeftRadius: 16,
    borderRightColor: 'transparent',
    ...Platform.select({
      android: {
        borderRightWidth: 0,
      },
    }),
  },
  messageRepliesCurve: {
    borderTopColor: 'transparent',
    borderTopWidth: 0,
    borderWidth: 1,
    height: 16,
    width: 16,
  },
  messageRepliesText: {
    fontSize: 12,
    fontWeight: '700',
    paddingBottom: 5,
    paddingLeft: 8,
  },
  rightMessageRepliesCurve: {
    borderBottomRightRadius: 16,
    borderLeftColor: 'transparent',
    ...Platform.select({
      android: {
        borderLeftWidth: 0,
      },
    }),
  },
});

export type MessageRepliesPropsWithContext<
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
> = Pick<
  MessageContextValue<StreamChatClient>,
  | 'alignment'
  | 'message'
  | 'onLongPress'
  | 'onPress'
  | 'onPressIn'
  | 'onOpenThread'
  | 'preventPress'
  | 'threadList'
> &
  Pick<MessagesContextValue<StreamChatClient>, 'MessageRepliesAvatars'> &
  Pick<TranslationContextValue, 't'> & {
    noBorder?: boolean;
    repliesCurveColor?: ColorValue;
  };

const MessageRepliesWithContext = <
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
>(
  props: MessageRepliesPropsWithContext<StreamChatClient>,
) => {
  const {
    alignment,
    message,
    MessageRepliesAvatars,
    noBorder,
    onLongPress,
    onOpenThread,
    onPress,
    onPressIn,
    preventPress,
    repliesCurveColor,
    t,
    threadList,
  } = props;

  const {
    theme: {
      colors: { accent_blue },
      messageSimple: {
        replies: { container, leftCurve, messageRepliesText, rightCurve },
      },
    },
  } = useTheme();

  if (threadList || !message.reply_count) return null;

  return (
    <View style={styles.curveContainer}>
      {alignment === 'left' && (
        <View testID='message-replies-left'>
          {!noBorder && (
            <View
              style={[
                { borderColor: repliesCurveColor },
                styles.messageRepliesCurve,
                styles.leftMessageRepliesCurve,
                leftCurve,
              ]}
            />
          )}
          <MessageRepliesAvatars alignment={alignment} message={message} />
        </View>
      )}
      <TouchableOpacity
        disabled={preventPress}
        onLongPress={(event) => {
          if (onLongPress) {
            onLongPress({
              emitter: 'messageReplies',
              event,
            });
          }
        }}
        onPress={(event) => {
          if (onPress) {
            onPress({
              defaultHandler: onOpenThread,
              emitter: 'messageReplies',
              event,
            });
          }
        }}
        onPressIn={(event) => {
          if (onPressIn) {
            onPressIn({
              defaultHandler: onOpenThread,
              emitter: 'messageReplies',
              event,
            });
          }
        }}
        style={[styles.container, container]}
        testID='message-replies'
      >
        <Text style={[styles.messageRepliesText, { color: accent_blue }, messageRepliesText]}>
          {message.reply_count === 1
            ? t('1 Thread Reply')
            : t('{{ replyCount }} Thread Replies', {
                replyCount: message.reply_count,
              })}
        </Text>
      </TouchableOpacity>
      {alignment === 'right' && (
        <View testID='message-replies-right'>
          <MessageRepliesAvatars alignment={alignment} message={message} />
          {!noBorder && (
            <View
              style={[
                { borderColor: repliesCurveColor },
                styles.messageRepliesCurve,
                styles.rightMessageRepliesCurve,
                rightCurve,
              ]}
            />
          )}
        </View>
      )}
    </View>
  );
};

const areEqual = <StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics>(
  prevProps: MessageRepliesPropsWithContext<StreamChatClient>,
  nextProps: MessageRepliesPropsWithContext<StreamChatClient>,
) => {
  const {
    message: prevMessage,
    noBorder: prevNoBorder,
    onOpenThread: prevOnOpenThread,
    t: prevT,
    threadList: prevThreadList,
  } = prevProps;
  const {
    message: nextMessage,
    noBorder: nextNoBorder,
    onOpenThread: nextOnOpenThread,
    t: nextT,
    threadList: nextThreadList,
  } = nextProps;

  const threadListEqual = prevThreadList === nextThreadList;
  if (!threadListEqual) return false;

  const messageReplyCountEqual = prevMessage.reply_count === nextMessage.reply_count;
  if (!messageReplyCountEqual) return false;

  const noBorderEqual = prevNoBorder === nextNoBorder;
  if (!noBorderEqual) return false;

  const tEqual = prevT === nextT;
  if (!tEqual) return false;

  const onOpenThreadEqual = prevOnOpenThread === nextOnOpenThread;
  if (!onOpenThreadEqual) return false;

  return true;
};

const MemoizedMessageReplies = React.memo(
  MessageRepliesWithContext,
  areEqual,
) as typeof MessageRepliesWithContext;

export type MessageRepliesProps<
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
> = Partial<MessageRepliesPropsWithContext<StreamChatClient>>;

export const MessageReplies = <
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
>(
  props: MessageRepliesProps<StreamChatClient>,
) => {
  const {
    alignment,
    message,
    onLongPress,
    onOpenThread,
    onPress,
    onPressIn,
    preventPress,
    threadList,
  } = useMessageContext<StreamChatClient>();
  const { MessageRepliesAvatars } = useMessagesContext<StreamChatClient>();
  const { t } = useTranslationContext();

  return (
    <MemoizedMessageReplies
      {...{
        alignment,
        message,
        MessageRepliesAvatars,
        onLongPress,
        onOpenThread,
        onPress,
        onPressIn,
        preventPress,
        t,
        threadList,
      }}
      {...props}
    />
  );
};

MessageReplies.displayName = 'MessageReplies{messageSimple{replies}}';
