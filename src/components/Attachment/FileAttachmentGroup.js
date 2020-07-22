import React from 'react';
import PropTypes from 'prop-types';
import styled from '@stream-io/styled-components';
import Attachment from './Attachment';

const Container = styled.View`
  display: flex;
  align-items: stretch;
`;

class FileAttachmentGroup extends React.PureComponent {
  static propTypes = {
    messageId: PropTypes.string,
    files: PropTypes.array,
    handleAction: PropTypes.func,
    alignment: PropTypes.oneOf(['right', 'left']),
    /**
     * Custom UI component to display File type attachment.
     * Deaults to https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/FileAttachment.js
     */
    FileAttachment: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.elementType,
    ]),
    /**
     * Custom UI component for attachment icon for type 'file' attachment.
     * Defaults to: https://github.com/GetStream/stream-chat-react-native/blob/master/src/components/FileIcon.js
     */
    AttachmentFileIcon: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.elementType,
    ]),
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      messageId,
      files,
      handleAction,
      alignment,
      FileAttachment,
      AttachmentFileIcon,
      AttachmentActions,
    } = this.props;

    return (
      <Container>
        {files &&
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
                key={`${messageId}-${index}`}
                attachment={file}
                actionHandler={handleAction}
                alignment={alignment}
                groupStyle={groupStyle}
                AttachmentFileIcon={AttachmentFileIcon}
                FileAttachment={FileAttachment}
                AttachmentActions={AttachmentActions}
              />
            );
          })}
      </Container>
    );
  }
}

export default FileAttachmentGroup;
