import React, { useState } from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';

import merge from 'lodash/merge';

import type { Attachment } from 'stream-chat';

import { useMessageContext } from '../../contexts/messageContext/MessageContext';
import {
  MessageInputContextValue,
  useMessageInputContext,
} from '../../contexts/messageInputContext/MessageInputContext';
import {
  MessagesContextValue,
  useMessagesContext,
} from '../../contexts/messagesContext/MessagesContext';
import { useTheme } from '../../contexts/themeContext/ThemeContext';
import {
  TranslationContextValue,
  useTranslationContext,
} from '../../contexts/translationContext/TranslationContext';
import type { DefaultStreamChatGenerics } from '../../types/types';
import { getResizedImageUrl } from '../../utils/getResizedImageUrl';
import { emojiRegex } from '../../utils/utils';

import { FileIcon as FileIconDefault } from '../Attachment/FileIcon';
import { MessageAvatar as MessageAvatarDefault } from '../Message/MessageSimple/MessageAvatar';
import { MessageTextContainer } from '../Message/MessageSimple/MessageTextContainer';

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  fileAttachmentContainer: { paddingLeft: 8, paddingVertical: 8 },
  imageAttachment: {
    borderRadius: 8,
    height: 32,
    marginLeft: 8,
    marginVertical: 8,
    width: 32,
  },
  messageContainer: {
    alignItems: 'flex-start',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
  },
  text: { fontSize: 12 },
  textContainer: { maxWidth: undefined, paddingHorizontal: 8 },
});

type ReplyPropsWithContext<
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
> = Pick<MessageInputContextValue<StreamChatClient>, 'quotedMessage'> &
  Pick<MessagesContextValue<StreamChatClient>, 'FileAttachmentIcon' | 'MessageAvatar'> &
  Pick<TranslationContextValue, 't'> & {
    attachmentSize?: number;
    styles?: Partial<{
      container: ViewStyle;
      fileAttachmentContainer: ViewStyle;
      imageAttachment: ImageStyle;
      messageContainer: ViewStyle;
      textContainer: ViewStyle;
    }>;
  };

const ReplyWithContext = <
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  props: ReplyPropsWithContext<StreamChatClient>,
) => {
  const {
    FileAttachmentIcon,
    attachmentSize = 40,
    MessageAvatar,
    quotedMessage,
    styles: stylesProp = {},
    t,
  } = props;

  const [error, setError] = useState(false);

  const {
    theme: {
      colors: { blue_alice, border, grey, transparent, white },
      messageSimple: {
        content: { deletedText },
      },
      reply: {
        container,
        fileAttachmentContainer,
        imageAttachment,
        markdownStyles,
        messageContainer,
        textContainer,
      },
    },
  } = useTheme();

  if (typeof quotedMessage === 'boolean') return null;

  const lastAttachment = quotedMessage.attachments?.slice(-1)[0] as Attachment<StreamChatClient>;

  const messageType = lastAttachment
    ? lastAttachment.type === 'file' || lastAttachment.type === 'audio'
      ? 'file'
      : lastAttachment.type === 'image' &&
        !lastAttachment.title_link &&
        !lastAttachment.og_scrape_url
      ? lastAttachment.image_url || lastAttachment.thumb_url
        ? 'image'
        : undefined
      : lastAttachment.type === 'giphy' || lastAttachment.type === 'imgur'
      ? 'giphy'
      : 'other'
    : undefined;

  const hasImage =
    !error &&
    lastAttachment &&
    messageType !== 'file' &&
    (lastAttachment.image_url || lastAttachment.thumb_url || lastAttachment.og_scrape_url);

  const onlyEmojis = !lastAttachment && !!quotedMessage.text && emojiRegex.test(quotedMessage.text);

  return (
    <View style={[styles.container, container, stylesProp.container]}>
      <MessageAvatar alignment={'left'} lastGroupMessage message={quotedMessage} size={24} />
      <View
        style={[
          styles.messageContainer,
          {
            backgroundColor:
              messageType === 'other' ? blue_alice : messageType === 'giphy' ? transparent : white,
            borderColor: border,
            borderWidth: messageType === 'other' ? 0 : 1,
          },
          messageContainer,
          stylesProp.messageContainer,
        ]}
      >
        {!error && lastAttachment ? (
          messageType === 'file' ? (
            <View
              style={[
                styles.fileAttachmentContainer,
                fileAttachmentContainer,
                stylesProp.fileAttachmentContainer,
              ]}
            >
              <FileAttachmentIcon mimeType={lastAttachment.mime_type} size={attachmentSize} />
            </View>
          ) : hasImage ? (
            <Image
              onError={() => setError(true)}
              source={{
                uri: getResizedImageUrl({
                  height:
                    stylesProp.imageAttachment?.height ||
                    imageAttachment?.height ||
                    styles.imageAttachment.height,
                  url: (lastAttachment.image_url ||
                    lastAttachment.thumb_url ||
                    lastAttachment.og_scrape_url) as string,
                  width:
                    stylesProp.imageAttachment?.width ||
                    imageAttachment?.width ||
                    styles.imageAttachment.width,
                }),
              }}
              style={[styles.imageAttachment, imageAttachment, stylesProp.imageAttachment]}
            />
          ) : null
        ) : null}
        <MessageTextContainer<StreamChatClient>
          markdownStyles={
            quotedMessage.deleted_at
              ? merge({ em: { color: grey } }, deletedText)
              : { text: styles.text, ...markdownStyles }
          }
          message={{
            ...quotedMessage,
            text: quotedMessage.deleted_at
              ? `_${t('Message deleted')}_`
              : quotedMessage.text
              ? quotedMessage.text.length > 170
                ? `${quotedMessage.text.slice(0, 170)}...`
                : quotedMessage.text
              : messageType === 'image'
              ? t('Photo')
              : messageType === 'file'
              ? lastAttachment?.title || ''
              : '',
          }}
          onlyEmojis={onlyEmojis}
          styles={{
            textContainer: [
              {
                marginRight: hasImage
                  ? Number(
                      stylesProp.imageAttachment?.height ||
                        imageAttachment.height ||
                        styles.imageAttachment.height,
                    ) +
                    Number(
                      stylesProp.imageAttachment?.marginLeft ||
                        imageAttachment.marginLeft ||
                        styles.imageAttachment.marginLeft,
                    )
                  : messageType === 'file'
                  ? attachmentSize +
                    Number(
                      stylesProp.fileAttachmentContainer?.paddingLeft ||
                        fileAttachmentContainer.paddingLeft ||
                        styles.fileAttachmentContainer.paddingLeft,
                    )
                  : undefined,
              },
              styles.textContainer,
              textContainer,
              stylesProp.textContainer,
            ],
          }}
        />
      </View>
    </View>
  );
};

const areEqual = <StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics>(
  prevProps: ReplyPropsWithContext<StreamChatClient>,
  nextProps: ReplyPropsWithContext<StreamChatClient>,
) => {
  const { quotedMessage: prevQuotedMessage } = prevProps;
  const { quotedMessage: nextQuotedMessage } = nextProps;

  const quotedMessageEqual =
    !!prevQuotedMessage &&
    !!nextQuotedMessage &&
    typeof prevQuotedMessage !== 'boolean' &&
    typeof nextQuotedMessage !== 'boolean'
      ? prevQuotedMessage.id === nextQuotedMessage.id &&
        prevQuotedMessage.deleted_at === nextQuotedMessage.deleted_at
      : !!prevQuotedMessage === !!nextQuotedMessage;

  if (!quotedMessageEqual) return false;

  return true;
};

const MemoizedReply = React.memo(ReplyWithContext, areEqual) as typeof ReplyWithContext;

export type ReplyProps<
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
> = Partial<ReplyPropsWithContext<StreamChatClient>>;

/**
 * UI Component for reply
 */
export const Reply = <
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  props: ReplyProps<StreamChatClient>,
) => {
  const { message } = useMessageContext<StreamChatClient>();

  const { FileAttachmentIcon = FileIconDefault, MessageAvatar = MessageAvatarDefault } =
    useMessagesContext<StreamChatClient>();

  const { editing, quotedMessage } = useMessageInputContext<StreamChatClient>();

  const quotedEditingMessage = (
    typeof editing !== 'boolean' ? editing?.quoted_message || false : false
  ) as MessageInputContextValue<StreamChatClient>['quotedMessage'];

  const { t } = useTranslationContext();

  return (
    <MemoizedReply
      {...{
        FileAttachmentIcon,
        MessageAvatar,
        quotedMessage: message
          ? (message.quoted_message as MessageInputContextValue<StreamChatClient>['quotedMessage'])
          : quotedMessage || quotedEditingMessage,
        t,
      }}
      {...props}
    />
  );
};

Reply.displayName = 'Reply{reply}';
