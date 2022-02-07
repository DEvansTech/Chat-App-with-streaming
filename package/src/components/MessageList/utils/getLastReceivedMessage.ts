import type { ExtendableGenerics } from 'stream-chat';

import type { DefaultStreamChatGenerics } from '../../../types/types';
import { MessageStatusTypes } from '../../../utils/utils';

import type { MessageType } from '../hooks/useMessageList';

export const getLastReceivedMessage = <
  StreamChatClient extends ExtendableGenerics = DefaultStreamChatGenerics,
>(
  messages: MessageType<StreamChatClient>[],
) => {
  /**
   * There are no status on dates so they will be skipped
   */
  for (const message of messages) {
    if (
      message?.status === MessageStatusTypes.RECEIVED ||
      message?.status === MessageStatusTypes.SENDING
    ) {
      return message;
    }
  }

  return;
};
