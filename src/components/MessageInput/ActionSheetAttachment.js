import React from 'react';
import { ActionSheetCustom } from 'react-native-actionsheet';
import styled from '@stream-io/styled-components';

import { IconSquare } from '../IconSquare';

import { withTranslationContext } from '../../context';

import iconGallery from '../../images/icons/icon_attach-media.png';
import iconClose from '../../images/icons/icon_close.png';
import iconFolder from '../../images/icons/icon_folder.png';

const ActionSheetButtonContainer = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  width: 100%;
  ${({ theme }) => theme.messageInput.actionSheet.buttonContainer.css};
`;

const ActionSheetButtonText = styled.Text`
  ${({ theme }) => theme.messageInput.actionSheet.buttonText.css};
`;

const ActionSheetTitleContainer = styled.View`
  align-items: center;
  flex-direction: row;
  height: 100%;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  width: 100%;
  ${({ theme }) => theme.messageInput.actionSheet.titleContainer.css};
`;

const ActionSheetTitleText = styled.Text`
  font-weight: bold;
  ${({ theme }) => theme.messageInput.actionSheet.titleText.css};
`;

const ActionSheet = ({
  closeAttachActionSheet,
  pickFile,
  pickImage,
  setAttachActionSheetRef,
  styles,
  t,
}) => (
  <ActionSheetCustom
    ref={setAttachActionSheetRef}
    title={
      <ActionSheetTitleContainer>
        <ActionSheetTitleText>{t('Add a file')}</ActionSheetTitleText>
        <IconSquare icon={iconClose} onPress={closeAttachActionSheet} />
      </ActionSheetTitleContainer>
    }
    options={[
      /* eslint-disable */
      <AttachmentActionSheetItem
        icon={iconGallery}
        text={t('Upload a photo')}
      />,
      <AttachmentActionSheetItem icon={iconFolder} text={t('Upload a file')} />,
      /* eslint-enable */
    ]}
    onPress={(index) => {
      // https://github.com/beefe/react-native-actionsheet/issues/36
      setTimeout(() => {
        switch (index) {
          case 0:
            pickImage();
            break;
          case 1:
            pickFile();
            break;
          default:
        }
      }, 201); // 201ms to fire after the animation is complete https://github.com/beefe/react-native-actionsheet/blob/master/lib/ActionSheetCustom.js#L78
    }}
    styles={styles}
  />
);

const AttachmentActionSheetItem = ({ icon, text }) => (
  <ActionSheetButtonContainer>
    <IconSquare icon={icon} />
    <ActionSheetButtonText>{text}</ActionSheetButtonText>
  </ActionSheetButtonContainer>
);

export default withTranslationContext(ActionSheet);
