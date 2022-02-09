import type { DefaultStreamChatGenerics } from '../../../types/types';
import type { MessageType } from '../../MessageList/hooks/useMessageList';

export const removeReservedFields = <
  StreamChatClient extends DefaultStreamChatGenerics = DefaultStreamChatGenerics,
>(
  message: MessageType<StreamChatClient>,
) => {
  const retryMessage = { ...message };
  const reserved = [
    'cid',
    'config',
    'created_at',
    'created_by',
    'id',
    'last_message_at',
    'member_count',
    'type',
    'updated_at',
  ];
  reserved.forEach((key) => {
    delete retryMessage[key];
  });

  return retryMessage;
};
