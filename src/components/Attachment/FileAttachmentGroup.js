import React from 'react';
import PropTypes from 'prop-types';
import styled from '@stream-io/styled-components';

import Attachment from './Attachment';

const Container = styled.View`
  align-items: stretch;
`;

const FileAttachmentGroup = (props) => {
  const {
    alignment,
    AttachmentActions,
    AttachmentFileIcon,
    FileAttachment,
    files,
    handleAction,
    messageId,
  } = props;

  return (
    <Container>
      {files.length &&
        files.map((file, index, files) => {
          let groupStyle;

          if (files.length === 1) groupStyle = 'single';
          else if (index === 0) {
            groupStyle = 'top';
          } else if (index < files.length - 1 && index > 0) {
            groupStyle = 'middle';
          } else if (index === files.length - 1) groupStyle = 'bottom';

          return (
            <Attachment
              actionHandler={handleAction}
              alignment={alignment}
              attachment={file}
              AttachmentActions={AttachmentActions}
              AttachmentFileIcon={AttachmentFileIcon}
              FileAttachment={FileAttachment}
              groupStyle={groupStyle}
              key={`${messageId}-${index}`}
            />
          );
        })}
    </Container>
  );
};

FileAttachmentGroup.propTypes = {
  messageId: PropTypes.string,
  files: PropTypes.array,
  handleAction: PropTypes.func,
  alignment: PropTypes.oneOf(['right', 'left']),
  /**
   * Custom UI component to display File type attachment.
   * Defaults to https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/FileAttachment.js
   */
  FileAttachment: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  /**
   * Custom UI component for attachment icon for type 'file' attachment.
   * Defaults to: https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/FileIcon.js
   */
  AttachmentFileIcon: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType,
  ]),
};

export default FileAttachmentGroup;
