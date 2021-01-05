import { vh } from '../../../utils/utils';

import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { CircleProps, StopProps } from 'react-native-svg';

import type { IconProps } from '../../../icons/utils/base';

export const DEFAULT_STATUS_ICON_SIZE = 16;

export const Colors = {
  accent_blue: '#005FFF',
  accent_green: '#20E070',
  accent_red: '#FF3742',
  bg_gradient_end: '#F7F7F7',
  bg_gradient_start: '#FCFCFC',
  black: '#000000',
  blue_alice: '#E9F2FF',
  border: '#00000014', // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
  grey: '#7A7A7A',
  grey_gainsboro: '#DBDBDB',
  grey_whisper: '#ECEBEB',
  icon_background: '#FFFFFF',
  modal_shadow: '#00000099', // 99 = 60% opacity; x=0, y= 1, radius=4
  overlay: '#00000033', // 33 = 20% opacity
  overlay_dark: '#00000099', // 99 = 60% opacity
  shadow_icon: '#00000040', // 40 = 25% opacity; x=0, y=0, radius=4
  targetedMessageBackground: '#FBF4DD', // dark mode = #302D22
  transparent: 'transparent',
  white: '#FFFFFF',
  white_smoke: '#F2F2F2',
  white_snow: '#FCFCFC',
};

export type MarkdownStyle = Partial<{
  autolink: TextStyle;
  blockQuoteBar: ViewStyle;
  blockQuoteSection: ViewStyle;
  blockQuoteSectionBar: ViewStyle;
  blockQuoteText: TextStyle | ViewStyle;
  br: TextStyle;
  codeBlock: TextStyle;
  del: TextStyle;
  em: TextStyle;
  heading: TextStyle;
  heading1: TextStyle;
  heading2: TextStyle;
  heading3: TextStyle;
  heading4: TextStyle;
  heading5: TextStyle;
  heading6: TextStyle;
  hr: ViewStyle;
  image: ImageStyle;
  inlineCode: TextStyle;
  list: ViewStyle;
  listItem: ViewStyle;
  listItemBullet: TextStyle;
  listItemNumber: TextStyle;
  listItemText: TextStyle;
  listRow: ViewStyle;
  mailTo: TextStyle;
  mentions: TextStyle;
  newline: TextStyle;
  noMargin: TextStyle;
  paragraph: TextStyle;
  paragraphCenter: TextStyle;
  paragraphWithImage: ViewStyle;
  strong: TextStyle;
  sublist: ViewStyle;
  table: ViewStyle;
  tableHeader: ViewStyle;
  tableHeaderCell: TextStyle;
  tableRow: ViewStyle;
  tableRowCell: ViewStyle;
  tableRowLast: ViewStyle;
  text: TextStyle;
  u: TextStyle;
  view: ViewStyle;
}>;

export type Theme = {
  attachmentPicker: {
    bottomSheetContentContainer: ViewStyle;
    errorButtonText: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    image: ViewStyle;
    imageOverlay: ViewStyle;
    imageOverlaySelectedComponent: {
      check: ViewStyle;
    };
  };
  attachmentSelectionBar: {
    container: ViewStyle;
    icon: ViewStyle;
  };
  avatar: {
    BASE_AVATAR_SIZE: number;
    container: ViewStyle;
    image: ImageStyle;
    presenceIndicator: CircleProps;
    presenceIndicatorContainer: ViewStyle;
  };
  channel: {
    selectChannel: TextStyle;
  };
  channelInfoOverlay: {
    avatarPresenceIndicator: CircleProps;
    avatarPresenceIndicatorStyle: ViewStyle;
    avatarSize: number;
    channelName: TextStyle;
    channelStatus: TextStyle;
    container: ViewStyle;
    containerInner: ViewStyle;
    deleteRow: ViewStyle;
    deleteText: TextStyle;
    detailsContainer: ViewStyle;
    flatList: ViewStyle;
    flatListContent: ViewStyle;
    leaveGroupRow: ViewStyle;
    leaveGroupText: TextStyle;
    row: ViewStyle;
    rowInner: ViewStyle;
    userItemContainer: ViewStyle;
    userName: TextStyle;
  };
  channelListFooterLoadingIndicator: {
    container: ViewStyle;
  };
  channelListHeaderErrorIndicator: {
    container: ViewStyle;
    errorText: TextStyle;
  };
  channelListMessenger: {
    flatList: ViewStyle;
    flatListContent: ViewStyle;
  };
  channelListSkeleton: {
    animationTime: number;
    background: ViewStyle;
    container: ViewStyle;
    gradientStart: StopProps;
    gradientStop: StopProps;
    height: number;
  };
  channelPreview: {
    checkAllIcon: IconProps;
    checkIcon: IconProps;
    container: ViewStyle;
    contentContainer: ViewStyle;
    date: TextStyle;
    leftSwipeableButton: ViewStyle;
    message: TextStyle & {
      fontWeight: TextStyle['fontWeight'];
    };
    rightSwipeableButton: ViewStyle;
    row: ViewStyle;
    swipeableContainer: ViewStyle;
    title: TextStyle;
    unreadContainer: ViewStyle;
    unreadText: TextStyle;
  };
  colors: typeof Colors & { [key: string]: string };
  dateHeader: {
    container: ViewStyle;
    text: TextStyle;
  };
  emptyStateIndicator: {
    channelContainer: ViewStyle;
    channelDetails: TextStyle;
    channelTitle: TextStyle;
  };
  groupAvatar: {
    container: ViewStyle;
    image: ImageStyle;
  };
  iconBadge: {
    icon: ViewStyle;
    iconInner: ViewStyle;
    unreadCount: TextStyle;
  };
  iconSquare: {
    container: ViewStyle;
    image: ImageStyle;
  };
  imageGallery: {
    blurType: 'light' | 'dark';
    footer: {
      centerContainer: ViewStyle;
      container: ViewStyle;
      imageCountText: TextStyle;
      innerContainer: ViewStyle;
      leftContainer: ViewStyle;
      rightContainer: ViewStyle;
    };
    grid: {
      contentContainer: ViewStyle;
      gridAvatar: ImageStyle;
      gridAvatarWrapper: ViewStyle;
      gridImage: ViewStyle;
      handle: ViewStyle;
      handleText: TextStyle;
      overlay: ViewStyle;
    };
    header: {
      centerContainer: ViewStyle;
      container: ViewStyle;
      dateText: TextStyle;
      innerContainer: ViewStyle;
      leftContainer: ViewStyle;
      rightContainer: ViewStyle;
      usernameText: TextStyle;
    };
    backgroundColor?: string;
  };
  loadingDots: {
    container: ViewStyle;
    loadingDot: ViewStyle;
    spacing: number;
  };
  loadingErrorIndicator: {
    container: ViewStyle;
    errorText: TextStyle;
    retryText: TextStyle;
  };
  loadingIndicator: {
    container: ViewStyle;
    loadingText: TextStyle;
  };
  messageInput: {
    attachButton: ViewStyle;
    attachButtonContainer: ViewStyle;
    attachmentSelectionBar: ViewStyle;
    autoCompleteInputContainer: ViewStyle;
    commandsButton: ViewStyle;
    commandsButtonContainer: ViewStyle;
    composerContainer: ViewStyle;
    container: ViewStyle;
    editingBoxContainer: ViewStyle;
    editingBoxHeader: ViewStyle;
    editingBoxHeaderTitle: TextStyle;
    fileUploadPreview: {
      dismiss: ViewStyle;
      fileContainer: ViewStyle;
      fileContentContainer: ViewStyle;
      filenameText: TextStyle;
      fileSizeText: TextStyle;
      fileTextContainer: ViewStyle;
      flatList: ViewStyle;
    };
    giphyContainer: ViewStyle;
    giphyText: TextStyle;
    imageUploadPreview: {
      dismiss: ViewStyle;
      flatList: ViewStyle;
      itemContainer: ViewStyle;
      upload: ImageStyle;
    };
    inputBox: TextStyle;
    inputBoxContainer: ViewStyle;
    moreOptionsButton: ViewStyle;
    optionsContainer: ViewStyle;
    replyContainer: ViewStyle;
    sendButton: ViewStyle;
    sendButtonContainer: ViewStyle;
    showThreadMessageInChannelButton: {
      check: IconProps;
      checkBoxActive: ViewStyle;
      checkBoxInactive: ViewStyle;
      container: ViewStyle;
      innerContainer: ViewStyle;
      text: TextStyle;
    };
    suggestions: {
      command: {
        args: TextStyle;
        container: ViewStyle;
        iconContainer: ViewStyle;
        title: TextStyle;
      };
      commandsHeader: {
        container: ViewStyle;
        title: TextStyle;
      };
      container: ViewStyle & {
        maxHeight: number;
      };
      emoji: {
        container: ViewStyle;
        text: TextStyle;
      };
      emojisHeader: {
        container: ViewStyle;
        title: TextStyle;
      };
      item: ViewStyle;
      mention: {
        avatarSize: number;
        column: ViewStyle;
        container: ViewStyle;
        name: TextStyle;
        tag: TextStyle;
      };
    };
    suggestionsListContainer: ViewStyle;
    uploadProgressIndicator: {
      container: ViewStyle;
      overlay: ViewStyle;
    };
  };
  messageList: {
    container: ViewStyle;
    errorNotification: ViewStyle;
    errorNotificationText: TextStyle;
    inlineUnreadIndicator: {
      container: ViewStyle;
      text: TextStyle;
    };
    listContainer: ViewStyle;
    messageNotification: {
      container: ViewStyle;
      touchable: ViewStyle;
      unreadCountNotificationContainer: ViewStyle;
      unreadCountNotificationText: TextStyle;
      wrapper: ViewStyle;
    };
    messageSystem: {
      container: ViewStyle;
      dateText: TextStyle;
      line: ViewStyle;
      text: TextStyle;
      textContainer: ViewStyle;
    };
    targetedMessageUnderlay: ViewStyle;
    typingIndicatorContainer: ViewStyle;
  };
  messageSimple: {
    actions: {
      button: ViewStyle & {
        defaultBackgroundColor?: ViewStyle['backgroundColor'];
        defaultBorderColor?: ViewStyle['borderColor'];
        primaryBackgroundColor?: ViewStyle['backgroundColor'];
        primaryBorderColor?: ViewStyle['borderColor'];
      };
      buttonText: TextStyle & {
        defaultColor?: TextStyle['color'];
        primaryColor?: TextStyle['color'];
      };
      container: ViewStyle;
    };
    avatarWrapper: {
      container: ViewStyle;
      leftAlign: ViewStyle;
      rightAlign: ViewStyle;
      spacer: ViewStyle;
    };
    card: {
      authorName: TextStyle;
      authorNameContainer: ViewStyle;
      authorNameFooter: TextStyle;
      authorNameFooterContainer: ViewStyle;
      authorNameMask: ViewStyle;
      container: ViewStyle;
      cover: ImageStyle;
      footer: ViewStyle & {
        description: TextStyle;
        title: TextStyle;
      };
      noURI: ViewStyle;
    };
    container: ViewStyle;
    content: {
      container: ViewStyle & {
        borderRadiusL: ViewStyle[
          | 'borderBottomLeftRadius'
          | 'borderTopLeftRadius'];
        borderRadiusS: ViewStyle[
          | 'borderBottomRightRadius'
          | 'borderTopRightRadius'];
      };
      containerInner: ViewStyle;
      deletedContainer: ViewStyle;
      deletedMetaText: TextStyle;
      deletedText: MarkdownStyle;
      errorContainer: ViewStyle;
      errorIcon: IconProps;
      errorIconContainer: ViewStyle;
      eyeIcon: IconProps;
      /**
       * Available options for styling text:
       * https://github.com/andangrd/react-native-markdown-package/blob/master/styles.js
       */
      markdown: MarkdownStyle;
      messageUser: TextStyle;
      metaContainer: ViewStyle;
      metaText: TextStyle;
      replyContainer: ViewStyle;
      textContainer: ViewStyle & {
        onlyEmojiMarkdown: MarkdownStyle;
      };
    };
    file: {
      container: ViewStyle;
      details: ViewStyle;
      fileSize: TextStyle;
      icon: IconProps;
      title: TextStyle;
    };
    fileAttachmentGroup: {
      container: ViewStyle;
    };
    gallery: {
      galleryContainer: ViewStyle;
      galleryItemColumn: ViewStyle;
      halfSize: ViewStyle['height'];
      image: ImageStyle;
      imageContainer: ViewStyle;
      moreImagesContainer: ViewStyle;
      moreImagesText: TextStyle;
      size: ViewStyle['height'];
      width: ViewStyle['width'];
    };
    giphy: {
      cancel: TextStyle;
      cancelContainer: ViewStyle;
      container: ViewStyle;
      giphy: ImageStyle;
      giphyContainer: ViewStyle;
      giphyMask: ViewStyle;
      giphyText: TextStyle;
      selectionContainer: ViewStyle;
      selector: ViewStyle;
      send: TextStyle;
      sendContainer: ViewStyle;
      shuffleButton: ViewStyle;
      title: TextStyle;
    };
    reactionList: {
      container: ViewStyle;
      middleIcon: ViewStyle;
      radius: number;
      reactionBubble: ViewStyle;
      reactionBubbleBackground: ViewStyle;
      reactionSize: number;
      strokeSize: number;
    };
    replies: {
      container: ViewStyle;
      messageRepliesText: TextStyle;
    };
    status: {
      checkAllIcon: IconProps;
      checkIcon: IconProps;
      readByCount: TextStyle;
      statusContainer: ViewStyle;
      timeIcon: IconProps;
    };
  };
  overlay: {
    padding: number;
    reactions: {
      avatarContainer: ViewStyle;
      avatarName: TextStyle;
      avatarSize: number;
      container: ViewStyle;
      flatListContainer: ViewStyle;
      radius: number;
      reactionBubble: ViewStyle;
      reactionBubbleBackground: ViewStyle;
      title: TextStyle;
    };
    reactionsList: {
      radius: number;
      reaction: ViewStyle;
      reactionList: ViewStyle;
    };
  };
  reply: {
    container: ViewStyle;
    fileAttachmentContainer: ViewStyle;
    imageAttachment: ImageStyle;
    markdownStyles: MarkdownStyle;
    messageContainer: ViewStyle;
    textContainer: ViewStyle;
  };
  screenPadding: number;
  spinner: ViewStyle;
  thread: {
    newThread: ViewStyle & {
      text: TextStyle;
      backgroundGradientStart?: string;
      backgroundGradientStop?: string;
    };
  };
  typingIndicator: {
    container: ViewStyle;
    text: TextStyle & {
      fontSize: TextStyle['fontSize'];
    };
  };
};

export const defaultTheme: Theme = {
  attachmentPicker: {
    bottomSheetContentContainer: {},
    errorButtonText: {},
    errorContainer: {},
    errorText: {},
    image: {},
    imageOverlay: {},
    imageOverlaySelectedComponent: {
      check: {},
    },
  },
  attachmentSelectionBar: {
    container: {},
    icon: {},
  },
  avatar: {
    BASE_AVATAR_SIZE: 32,
    container: {},
    image: {
      borderRadius: 16,
      height: 32,
      width: 32,
    },
    presenceIndicator: {
      cx: 8,
      cy: 4,
      r: 4,
      strokeWidth: 2,
    },
    presenceIndicatorContainer: {},
  },
  channel: {
    selectChannel: {},
  },
  channelInfoOverlay: {
    avatarPresenceIndicator: { cx: 6, cy: 6, r: 6 },
    avatarPresenceIndicatorStyle: {
      right: 4,
      top: 1,
    },
    avatarSize: 64,
    channelName: {},
    channelStatus: {},
    container: {},
    containerInner: {},
    deleteRow: {
      borderBottomWidth: 1,
    },
    deleteText: {},
    detailsContainer: {},
    flatList: {},
    flatListContent: {},
    leaveGroupRow: {},
    leaveGroupText: {},
    row: {},
    rowInner: {},
    userItemContainer: {},
    userName: {},
  },
  channelListFooterLoadingIndicator: {
    container: {},
  },
  channelListHeaderErrorIndicator: {
    container: {},
    errorText: {},
  },
  channelListMessenger: {
    flatList: {},
    flatListContent: {},
  },
  channelListSkeleton: {
    animationTime: 1000, // in milliseconds
    background: {},
    container: {},
    gradientStart: {
      stopOpacity: 0.1,
    },
    gradientStop: {
      stopOpacity: 0.5,
    },
    height: 64,
  },
  channelPreview: {
    checkAllIcon: {
      height: DEFAULT_STATUS_ICON_SIZE,
      width: DEFAULT_STATUS_ICON_SIZE,
    },
    checkIcon: {
      height: DEFAULT_STATUS_ICON_SIZE,
      width: DEFAULT_STATUS_ICON_SIZE,
    },
    container: {},
    contentContainer: {},
    date: {},
    leftSwipeableButton: {},
    message: {
      fontWeight: '400',
    },
    rightSwipeableButton: {},
    row: {},
    swipeableContainer: {},
    title: {},
    unreadContainer: {},
    unreadText: {},
  },
  colors: {
    ...Colors,
  },
  dateHeader: {
    container: {},
    text: {},
  },
  emptyStateIndicator: {
    channelContainer: {},
    channelDetails: {},
    channelTitle: {},
  },
  groupAvatar: {
    container: {},
    image: {
      resizeMode: 'cover',
    },
  },
  iconBadge: {
    icon: {},
    iconInner: {},
    unreadCount: {},
  },
  iconSquare: {
    container: {},
    image: {},
  },
  imageGallery: {
    blurType: 'light',
    footer: {
      centerContainer: {},
      container: {},
      imageCountText: {},
      innerContainer: {},
      leftContainer: {},
      rightContainer: {},
    },
    grid: {
      contentContainer: {},
      gridAvatar: {},
      gridAvatarWrapper: {},
      gridImage: {},
      handle: {},
      handleText: {},
      overlay: {},
    },
    header: {
      centerContainer: {},
      container: {},
      dateText: {},
      innerContainer: {},
      leftContainer: {},
      rightContainer: {},
      usernameText: {},
    },
  },
  loadingDots: {
    container: {},
    loadingDot: {},
    spacing: 4,
  },
  loadingErrorIndicator: {
    container: {},
    errorText: {},
    retryText: {},
  },
  loadingIndicator: {
    container: {},
    loadingText: {},
  },
  messageInput: {
    attachButton: {},
    attachButtonContainer: {},
    attachmentSelectionBar: {},
    autoCompleteInputContainer: {},
    commandsButton: {},
    commandsButtonContainer: {},
    composerContainer: {},
    container: {},
    editingBoxContainer: {},
    editingBoxHeader: {},
    editingBoxHeaderTitle: {},
    fileUploadPreview: {
      dismiss: {},
      fileContainer: {},
      fileContentContainer: {},
      filenameText: {},
      fileSizeText: {},
      fileTextContainer: {},
      flatList: {},
    },
    giphyContainer: {},
    giphyText: {},
    imageUploadPreview: {
      dismiss: {},
      flatList: {},
      itemContainer: {},
      upload: {},
    },
    inputBox: {},
    inputBoxContainer: {},
    moreOptionsButton: {},
    optionsContainer: {},
    replyContainer: {},
    sendButton: {},
    sendButtonContainer: {},
    showThreadMessageInChannelButton: {
      check: {},
      checkBoxActive: {},
      checkBoxInactive: {},
      container: {},
      innerContainer: {},
      text: {},
    },
    suggestions: {
      command: {
        args: {},
        container: {},
        iconContainer: {},
        title: {},
      },
      commandsHeader: {
        container: {},
        title: {},
      },
      container: {
        maxHeight: vh(25),
      },
      emoji: {
        container: {},
        text: {},
      },
      emojisHeader: {
        container: {},
        title: {},
      },
      item: {},
      mention: {
        avatarSize: 40,
        column: {},
        container: {},
        name: {},
        tag: {},
      },
    },
    suggestionsListContainer: {},
    uploadProgressIndicator: {
      container: {},
      overlay: {},
    },
  },
  messageList: {
    container: {},
    errorNotification: {},
    errorNotificationText: {},
    inlineUnreadIndicator: {
      container: {},
      text: {},
    },
    listContainer: {},
    messageNotification: {
      container: {},
      touchable: {},
      unreadCountNotificationContainer: {},
      unreadCountNotificationText: {},
      wrapper: {},
    },
    messageSystem: {
      container: {},
      dateText: {},
      line: {},
      text: {},
      textContainer: {},
    },
    targetedMessageUnderlay: {},
    typingIndicatorContainer: {},
  },
  messageSimple: {
    actions: {
      button: {},
      buttonText: {},
      container: {},
    },
    avatarWrapper: {
      container: {},
      leftAlign: {
        marginRight: 8,
      },
      rightAlign: {
        marginLeft: 8,
      },
      spacer: {
        height: 28,
        width: 32, // same as BASE_AVATAR_SIZE
      },
    },
    card: {
      authorName: {},
      authorNameContainer: {},
      authorNameFooter: {},
      authorNameFooterContainer: {},
      authorNameMask: {},
      container: {},
      cover: {},
      footer: {
        description: {},
        title: {
          fontWeight: '700',
        },
      },
      noURI: {
        borderLeftWidth: 2,
        paddingLeft: 8,
      },
    },
    container: {},
    content: {
      container: {
        borderRadiusL: 16,
        borderRadiusS: 0,
      },
      containerInner: {},
      deletedContainer: {},
      deletedMetaText: {
        paddingHorizontal: 10,
      },
      deletedText: {
        em: {
          fontSize: 15,
          fontStyle: 'italic',
          fontWeight: '400',
        },
      },
      errorContainer: {
        paddingRight: 12,
        paddingTop: 0,
      },
      errorIcon: {
        height: 20,
        width: 20,
      },
      errorIconContainer: {
        bottom: -2,
        position: 'absolute',
        right: -12,
      },
      eyeIcon: {
        height: 16,
        width: 16,
      },
      markdown: {
        autolink: {
          textDecorationLine: 'underline',
        },
      },
      messageUser: {
        fontSize: 12,
        fontWeight: '700',
        paddingRight: 6,
      },
      metaContainer: {
        flexDirection: 'row',
        marginTop: 4,
      },
      metaText: {
        fontSize: 12,
      },
      replyContainer: {},
      textContainer: {
        onlyEmojiMarkdown: { text: { fontSize: 50 } },
      },
    },
    file: {
      container: {},
      details: {},
      fileSize: {},
      icon: {},
      title: {},
    },
    fileAttachmentGroup: {
      container: {},
    },
    gallery: {
      galleryContainer: {},
      galleryItemColumn: {},
      halfSize: 100,
      image: {},
      imageContainer: {},
      moreImagesContainer: {},
      moreImagesText: {},
      size: 200,
      width: 250,
    },
    giphy: {
      cancel: {},
      cancelContainer: {},
      container: {},
      giphy: {},
      giphyContainer: {},
      giphyMask: {},
      giphyText: {},
      selectionContainer: {},
      selector: {},
      send: {},
      sendContainer: {},
      shuffleButton: {},
      title: {},
    },
    reactionList: {
      container: {},
      middleIcon: {},
      radius: 2, // not recommended to change this
      reactionBubble: {},
      reactionBubbleBackground: {},
      reactionSize: 24,
      strokeSize: 1, // not recommended to change this
    },
    replies: {
      container: {},
      messageRepliesText: {},
    },
    status: {
      checkAllIcon: {
        height: DEFAULT_STATUS_ICON_SIZE,
        width: DEFAULT_STATUS_ICON_SIZE,
      },
      checkIcon: {
        height: DEFAULT_STATUS_ICON_SIZE,
        width: DEFAULT_STATUS_ICON_SIZE,
      },
      readByCount: {},
      statusContainer: {},
      timeIcon: {
        height: DEFAULT_STATUS_ICON_SIZE,
        width: DEFAULT_STATUS_ICON_SIZE,
      },
    },
  },
  overlay: {
    padding: 8,
    reactions: {
      avatarContainer: {},
      avatarName: {},
      avatarSize: 64,
      container: {},
      flatListContainer: {},
      radius: 2,
      reactionBubble: {},
      reactionBubbleBackground: {},
      title: {},
    },
    reactionsList: {
      radius: 2.5,
      reaction: {},
      reactionList: {},
    },
  },
  reply: {
    container: {},
    fileAttachmentContainer: {},
    imageAttachment: {},
    markdownStyles: {},
    messageContainer: {},
    textContainer: {},
  },
  screenPadding: 8,
  spinner: {},
  thread: {
    newThread: {
      text: {},
    },
  },
  typingIndicator: {
    container: {},
    text: {
      fontSize: 14,
    },
  },
};
