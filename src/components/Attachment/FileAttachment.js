import React, { useContext } from 'react';
import { TouchableOpacity, Linking } from 'react-native';
import PropTypes from 'prop-types';
import styled from '@stream-io/styled-components';

import AttachmentActions from './AttachmentActions';
import { MessageContentContext } from '../../context';

const FileContainer = styled.View`
  align-items: center;
  background-color: #ebebeb;
  border-radius: ${({ groupStyle }) => {
    if (groupStyle === 'middle' || groupStyle === 'bottom') return 0;
    return 16;
  }};
  border-bottom-left-radius: ${({ alignment, groupStyle }) => {
    if (groupStyle === 'top' || groupStyle === 'middle') return 0;
    return alignment === 'right' ? 16 : 2;
  }};
  border-bottom-right-radius: ${({ alignment, groupStyle }) => {
    if (groupStyle === 'top' || groupStyle === 'middle') return 0;
    return alignment === 'left' ? 16 : 2;
  }};
  flex-direction: row;
  padding: 10px;
  ${({ theme }) => theme.message.file.container.css}
`;

const FileDetails = styled.View`
  flex-direction: column;
  padding-left: 10px;
  ${({ theme }) => theme.message.file.details.css}
`;

const FileSize = styled.Text`
  ${({ theme }) => theme.message.file.size.css}
`;

const FileTitle = styled.Text`
  font-weight: 700;
  ${({ theme }) => theme.message.file.title.css}
`;

const goToURL = (url) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  });
};

const FileAttachment = ({
  actionHandler,
  alignment,
  attachment,
  AttachmentFileIcon,
  groupStyle,
}) => {
  const { additionalTouchableProps, onLongPress } = useContext(
    MessageContentContext,
  );

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={() => {
        goToURL(attachment.asset_url);
      }}
      testID='file-attachment'
      {...additionalTouchableProps}
    >
      <FileContainer alignment={alignment} groupStyle={groupStyle}>
        <AttachmentFileIcon
          filename={attachment.title}
          mimeType={attachment.mime_type}
        />
        <FileDetails>
          <FileTitle numberOfLines={2}>{attachment.title}</FileTitle>
          <FileSize>{attachment.file_size} KB</FileSize>
        </FileDetails>
      </FileContainer>
      {attachment.actions?.length && (
        <AttachmentActions
          actionHandler={actionHandler}
          key={`key-actions-${attachment.id}`}
          {...attachment}
        />
      )}
    </TouchableOpacity>
  );
};

FileAttachment.propTypes = {
  /** The attachment to render */
  attachment: PropTypes.object.isRequired,
  /**
   * Position of message. 'right' | 'left'
   * 'right' message belongs with current user while 'left' message belongs to other users.
   * */
  alignment: PropTypes.string,
  /** Handler for actions. Actions in combination with attachments can be used to build [commands](https://getstream.io/chat/docs/#channel_commands). */
  actionHandler: PropTypes.func,
  /**
   * Position of message in group - top, bottom, middle, single.
   *
   * Message group is a group of consecutive messages from same user. groupStyles can be used to style message as per their position in message group
   * e.g., user avatar (to which message belongs to) is only showed for last (bottom) message in group.
   */
  groupStyle: PropTypes.oneOf(['single', 'top', 'middle', 'bottom']),
  /** Handler for long press event on attachment */
  onLongPress: PropTypes.func,
  /**
   * Provide any additional props for child `TouchableOpacity`.
   * Please check docs for TouchableOpacity for supported props - https://reactnative.dev/docs/touchableopacity#props
   */
  additionalTouchableProps: PropTypes.object,
  /**
   * Custom UI component for attachment icon for type 'file' attachment.
   * Defaults to and accepts same props as: https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/FileIcon.js
   */
  AttachmentFileIcon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType,
  ]),
  AttachmentActions: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType,
  ]),
};

export default FileAttachment;
