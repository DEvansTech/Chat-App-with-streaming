import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { ChannelPreview } from './ChannelPreview';
import { ChannelPreviewMessenger } from './ChannelPreviewMessenger';
import { withChatContext } from '../context';

import { LoadingIndicator } from './LoadingIndicator';
import { LoadingErrorIndicator } from './LoadingErrorIndicator';
import { EmptyStateIndicator } from './EmptyStateIndicator';

/**
 * ChannelListMessenger - UI component for list of channels, allowing you to select the channel you want to open
 *
 * @example ./docs/ChannelListMessenger.md
 */
const ChannelListMessenger = withChatContext(
  class ChannelListMessenger extends PureComponent {
    static propTypes = {
      /** Channels can be either an array of channels or a promise which resolves to an array of channels */
      channels: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.objectOf({
          then: PropTypes.func,
        }),
        PropTypes.object,
      ]).isRequired,
      setActiveChannel: PropTypes.func,
      /** UI Component to display individual channel item in list.
       * Defaults to [ChannelPreviewMessenger](https://getstream.github.io/stream-chat-react-native/#channelpreviewmessenger) */
      Preview: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
      /** The loading indicator to use. Default: [LoadingIndicator](https://getstream.github.io/stream-chat-react-native/#loadingindicator) */
      LoadingIndicator: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
      ]),
      /** The indicator to use when there is error in fetching channels. Default: [LoadingErrorIndicator](https://getstream.github.io/stream-chat-react-native/#loadingerrorindicator) */
      LoadingErrorIndicator: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
      ]),
      /** The indicator to use when channel list is empty. Default: [EmptyStateIndicator](https://getstream.github.io/stream-chat-react-native/#emptystateindicator) */
      EmptyStateIndicator: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.elementType,
      ]),
      /** Loads next page of channels in channels object, which is present here as prop */
      loadNextPage: PropTypes.func,
      /**
       * For flatlist
       * @see See loeadMoreThreshold [doc](https://facebook.github.io/react-native/docs/flatlist#onendreachedthreshold)
       * */
      loadMoreThreshold: PropTypes.number,
      /** If there is error in querying channels */
      error: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
      /** If channels are being queries. LoadingIndicator will be displayed if true */
      loadingChannels: PropTypes.bool,
      /**
       * Besides existing (default) UX behaviour of underlying flatlist of ChannelListMessenger component, if you want
       * to attach some additional props to un derlying flatlist, you can add it to following prop.
       *
       * You can find list of all the available FlatList props here - https://facebook.github.io/react-native/docs/flatlist#props
       *
       * **NOTE** Don't use `additionalFlatListProps` to get access to ref of flatlist. Use `setFlatListRef` instead.
       *
       * e.g.
       * ```
       * <ChannelListMessenger
       *  channels={channels}
       *  additionalFlatListProps={{ bounces: true }} />
       * ```
       */
      additionalFlatListProps: PropTypes.object,
      /**
       * Use `setFlatListRef` to get access to ref to inner FlatList.
       *
       * e.g.
       * ```
       * <ChannelListMessenger
       *  setFlatListRef={(ref) => {
       *    // Use ref for your own good
       *  }}
       * ```
       */
      setFlatListRef: PropTypes.func,
    };

    static defaultProps = {
      Preview: ChannelPreviewMessenger,
      LoadingIndicator,
      LoadingErrorIndicator,
      EmptyStateIndicator,
      // https://github.com/facebook/react-native/blob/a7a7970e543959e9db5281914d5f132beb01db8d/Libraries/Lists/VirtualizedList.js#L466
      loadMoreThreshold: 2,
      additionalFlatListProps: {},
    };

    renderLoading = () => {
      const Indicator = this.props.LoadingIndicator;
      return <Indicator listType="channel" />;
    };

    renderLoadingError = () => {
      const Indicator = this.props.LoadingErrorIndicator;
      return <Indicator error={this.props.error} listType="channel" />;
    };

    renderEmptyState = () => {
      const Indicator = this.props.EmptyStateIndicator;
      return <Indicator listType="channel" />;
    };

    renderChannels = () => (
      <FlatList
        ref={(flRef) => {
          this.props.setFlatListRef && this.props.setFlatListRef(flRef);
        }}
        data={this.props.channels}
        onEndReached={this.props.loadNextPage}
        onEndReachedThreshold={this.props.loadMoreThreshold}
        ListEmptyComponent={this.renderEmptyState}
        renderItem={({ item: channel }) => (
          <ChannelPreview
            {...this.props}
            key={channel.cid}
            channel={channel}
            Preview={this.props.Preview}
          />
        )}
        keyExtractor={(item) => item.cid}
        {...this.props.additionalFlatListProps}
      />
    );

    render() {
      if (this.props.error) {
        return this.renderLoadingError();
      } else if (this.props.loadingChannels) {
        return this.renderLoading();
      } else {
        return this.renderChannels();
      }
    }
  },
);

export { ChannelListMessenger };
