import type { MessageType } from '../../MessageList/hooks/useMessageList';

import type { MessageActionListItemMainProps } from '../../MessageOverlay/MessageActionListItem';
import type {
  DefaultAttachmentType,
  DefaultChannelType,
  DefaultCommandType,
  DefaultEventType,
  DefaultMessageType,
  DefaultReactionType,
  DefaultUserType,
  UnknownType,
} from '../../../types/types';

export const messageActions = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType,
>({
  blockUser,
  canModifyMessage,
  copyMessage,
  deleteMessage,
  editMessage,
  error,
  flagMessage,
  isMyMessage,
  isThreadMessage,
  message,
  messageReactions,
  mutesEnabled,
  muteUser,
  pinMessage,
  pinMessageEnabled,
  quotedRepliesEnabled,
  quotedReply,
  retry,
  threadRepliesEnabled,
  threadReply,
  unpinMessage,
}: {
  blockUser: MessageActionListItemMainProps | null;
  canModifyMessage: boolean;
  copyMessage: MessageActionListItemMainProps | null;
  deleteMessage: MessageActionListItemMainProps | null;
  editMessage: MessageActionListItemMainProps | null;
  error: boolean | Error;
  flagMessage: MessageActionListItemMainProps | null;
  isMyMessage: boolean;
  isThreadMessage: boolean;
  message: MessageType<At, Ch, Co, Ev, Me, Re, Us>;
  messageReactions: boolean;
  muteUser: MessageActionListItemMainProps | null;
  pinMessage: MessageActionListItemMainProps | null;
  quotedReply: MessageActionListItemMainProps | null;
  retry: MessageActionListItemMainProps | null;
  threadReply: MessageActionListItemMainProps | null;
  unpinMessage: MessageActionListItemMainProps | null;
  mutesEnabled?: boolean;
  pinMessageEnabled?: boolean;
  quotedRepliesEnabled?: boolean;
  threadRepliesEnabled?: boolean;
}): Array<MessageActionListItemMainProps | null> | undefined => {
  if (messageReactions) {
    return undefined;
  }

  const actions: Array<MessageActionListItemMainProps | null> = [];

  if (error && isMyMessage) {
    actions.push(retry);
  }

  if (quotedRepliesEnabled && !isThreadMessage && !error) {
    actions.push(quotedReply);
  }

  if (threadRepliesEnabled && !isThreadMessage && !error) {
    actions.push(threadReply);
  }

  if (canModifyMessage) {
    actions.push(editMessage);
  }

  if (message.text && !error) {
    actions.push(copyMessage);
  }

  if (!isMyMessage) {
    actions.push(flagMessage);
  }

  if (pinMessageEnabled && !message.pinned) {
    actions.push(pinMessage);
  }

  if (pinMessageEnabled && message.pinned) {
    actions.push(unpinMessage);
  }

  if (mutesEnabled && !isMyMessage) {
    actions.push(muteUser);
  }

  if (!isMyMessage && canModifyMessage) {
    actions.push(blockUser);
  }

  if (canModifyMessage) {
    actions.push(deleteMessage);
  }

  return actions;
};
