import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import Svg, { Circle } from 'react-native-svg';

import {
  MessageContextValue,
  Reactions,
  useMessageContext,
} from '../../../contexts/messageContext/MessageContext';
import {
  MessagesContextValue,
  useMessagesContext,
} from '../../../contexts/messagesContext/MessagesContext';
import { useTheme } from '../../../contexts/themeContext/ThemeContext';

import { Unknown } from '../../../icons/Unknown';

import type { IconProps } from '../../../icons/utils/base';
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
import type { ReactionData } from '../../../utils/utils';

const styles = StyleSheet.create({
  container: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  reactionBubble: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
  },
  reactionBubbleBackground: {
    position: 'absolute',
  },
});

export type MessageReactions = {
  reactions: Reactions;
  supportedReactions?: ReactionData[];
};

const Icon: React.FC<
  Pick<IconProps, 'pathFill' | 'style'> & {
    size: number;
    supportedReactions: ReactionData[];
    type: string;
  }
> = ({ pathFill, size, style, supportedReactions, type }) => {
  const ReactionIcon =
    supportedReactions.find((reaction) => reaction.type === type)?.Icon ||
    Unknown;
  return (
    <ReactionIcon
      height={size}
      pathFill={pathFill}
      style={style}
      width={size}
    />
  );
};

export type ReactionListPropsWithContext<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = Pick<
  MessageContextValue<At, Ch, Co, Ev, Me, Re, Us>,
  'alignment' | 'onLongPress' | 'reactions' | 'showMessageOverlay'
> &
  Pick<
    MessagesContextValue<At, Ch, Co, Ev, Me, Re, Us>,
    'supportedReactions'
  > & {
    messageContentWidth: number;
    fill?: string;
    radius?: number; // not recommended to change this
    reactionSize?: number;
    stroke?: string;
    strokeSize?: number; // not recommended to change this
  };

const ReactionListWithContext = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: ReactionListPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    alignment,
    fill: propFill,
    messageContentWidth,
    onLongPress,
    radius: propRadius,
    reactions,
    reactionSize: propReactionSize,
    showMessageOverlay,
    stroke: propStroke,
    strokeSize: propStrokeSize,
    supportedReactions,
  } = props;

  const {
    theme: {
      colors: { grey, primary, textGrey, white },
      messageSimple: {
        avatarWrapper: { leftAlign, spacer },
        reactionList: {
          container,
          middleIcon,
          radius: themeRadius,
          reactionBubble,
          reactionBubbleBackground,
          reactionSize: themeReactionSize,
          strokeSize: themeStrokeSize,
        },
      },
      screenPadding,
    },
  } = useTheme();

  const width = useWindowDimensions().width;

  const fill = propFill || grey;
  const radius = propRadius || themeRadius;
  const reactionSize = propReactionSize || themeReactionSize;
  const stroke = propStroke || white;
  const strokeSize = propStrokeSize || themeStrokeSize;

  const alignmentLeft = alignment === 'left';
  const x1 = alignmentLeft
    ? messageContentWidth +
      (Number(leftAlign.marginRight) || 0) +
      (Number(spacer.width) || 0) -
      radius * 0.5
    : width - screenPadding * 2 - messageContentWidth - radius * 1.5;
  const x2 = x1 + radius * 2 * (alignmentLeft ? 1 : -1);
  const y1 = reactionSize + radius * 2;
  const y2 = reactionSize - radius;

  const insideLeftBound =
    x2 - (reactionSize * reactions.length) / 2 > screenPadding;
  const insideRightBound =
    x2 + strokeSize + (reactionSize * reactions.length) / 2 <
    width - screenPadding * 2;
  const left =
    reactions.length === 1
      ? x1 + (alignmentLeft ? -radius : radius - reactionSize)
      : !insideLeftBound
      ? screenPadding
      : !insideRightBound
      ? width - screenPadding * 2 - reactionSize * reactions.length - strokeSize
      : x2 - (reactionSize * reactions.length) / 2 - strokeSize;

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      onPress={() => showMessageOverlay(true)}
      style={[
        styles.container,
        {
          height: reactionSize + radius * 5,
          width,
        },
        container,
      ]}
    >
      {reactions.length ? (
        <View style={StyleSheet.absoluteFill}>
          <Svg>
            <Circle cx={x1} cy={y1} fill={stroke} r={radius + strokeSize * 3} />
            <Circle
              cx={x2}
              cy={y2}
              fill={stroke}
              r={radius * 2 + strokeSize * 3}
            />
            <Circle cx={x1} cy={y1} fill={fill} r={radius + strokeSize} />
            <Circle cx={x2} cy={y2} fill={fill} r={radius * 2 + strokeSize} />
            <Circle
              cx={x1}
              cy={y1}
              fill={alignmentLeft ? fill : stroke}
              r={radius}
            />
            <Circle
              cx={x2}
              cy={y2}
              fill={alignmentLeft ? fill : stroke}
              r={radius * 2}
            />
          </Svg>
          <View
            style={[
              styles.reactionBubbleBackground,
              {
                backgroundColor: alignmentLeft ? fill : stroke,
                borderColor: fill,
                borderRadius: reactionSize,
                borderWidth: strokeSize,
                height: reactionSize,
                left,
                width: reactionSize * reactions.length,
              },
              reactionBubbleBackground,
            ]}
          />
          <View style={[StyleSheet.absoluteFill]}>
            <Svg>
              <Circle
                cx={x2}
                cy={y2}
                fill={alignmentLeft ? fill : stroke}
                r={radius * 2}
              />
            </Svg>
          </View>
          <View
            style={[
              styles.reactionBubble,
              {
                backgroundColor: alignmentLeft ? fill : stroke,
                borderRadius: reactionSize - strokeSize * 2,
                height: reactionSize - strokeSize * 2,
                left: left + strokeSize,
                top: strokeSize,
                width: reactionSize * reactions.length - strokeSize * 2,
              },
              reactionBubble,
            ]}
          >
            {reactions.map((reaction, index) => (
              <Icon
                key={`${reaction.type}_${index}_${Date.now()}`}
                pathFill={reaction.own ? primary : textGrey}
                size={reactionSize / 2}
                style={middleIcon}
                supportedReactions={supportedReactions}
                type={reaction.type}
              />
            ))}
          </View>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const areEqual = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  prevProps: ReactionListPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
  nextProps: ReactionListPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    messageContentWidth: prevMessageContentWidth,
    reactions: prevReactions,
  } = prevProps;
  const {
    messageContentWidth: nextMessageContentWidth,
    reactions: nextReactions,
  } = nextProps;

  const messageContentWidthEqual =
    prevMessageContentWidth === nextMessageContentWidth;
  if (!messageContentWidthEqual) return false;

  const reactionsEqual =
    prevReactions.length === nextReactions.length &&
    prevReactions.every(
      (latestReaction, index) =>
        nextReactions[index].own === latestReaction.own &&
        nextReactions[index].type === latestReaction.type,
    );
  if (!reactionsEqual) return false;

  return true;
};

const MemoizedReactionList = React.memo(
  ReactionListWithContext,
  areEqual,
) as typeof ReactionListWithContext;

export type ReactionListProps<
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
> = Partial<
  Omit<
    ReactionListPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
    'messageContentWidth'
  >
> &
  Pick<
    ReactionListPropsWithContext<At, Ch, Co, Ev, Me, Re, Us>,
    'messageContentWidth'
  >;

/**
 * ReactionList - A high level component which implements all the logic required for a message reaction list
 */
export const ReactionList = <
  At extends UnknownType = DefaultAttachmentType,
  Ch extends UnknownType = DefaultChannelType,
  Co extends string = DefaultCommandType,
  Ev extends UnknownType = DefaultEventType,
  Me extends UnknownType = DefaultMessageType,
  Re extends UnknownType = DefaultReactionType,
  Us extends UnknownType = DefaultUserType
>(
  props: ReactionListProps<At, Ch, Co, Ev, Me, Re, Us>,
) => {
  const {
    alignment,
    onLongPress,
    reactions,
    showMessageOverlay,
  } = useMessageContext<At, Ch, Co, Ev, Me, Re, Us>();
  const { supportedReactions } = useMessagesContext<
    At,
    Ch,
    Co,
    Ev,
    Me,
    Re,
    Us
  >();

  return (
    <MemoizedReactionList
      {...{
        alignment,
        onLongPress,
        reactions,
        showMessageOverlay,
        supportedReactions,
      }}
      {...props}
    />
  );
};
