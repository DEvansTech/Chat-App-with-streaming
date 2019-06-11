import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ChannelPreviewMessenger } from './ChannelPreviewMessenger';
import { withChatContext } from '../context';
import { ChannelListMessenger } from './ChannelListMessenger';
import Immutable from 'seamless-immutable';
import debounce from 'lodash/debounce';

import { LoadingIndicator } from './LoadingIndicator';
import { LoadingErrorIndicator } from './LoadingErrorIndicator';
import { EmptyStateIndicator } from './EmptyStateIndicator';
import uniqBy from 'lodash/uniqBy';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

/**
 * ChannelList - A preview list of channels, allowing you to select the channel you want to open
 * @extends PureComponent
 * @example ./docs/ChannelList.md
 */
export const isPromise = (thing) => {
  const promise = thing && typeof thing.then === 'function';
  return promise;
};

const ChannelList = withChatContext(
  class ChannelList extends PureComponent {
    static propTypes = {
      /** The Preview to use, defaults to ChannelPreviewMessenger */
      Preview: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

      /** The loading indicator to use */
      LoadingIndicator: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      /** The indicator to use when there is error in fetching channels */
      LoadingErrorIndicator: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
      ]),
      /** The indicator to use when channel list is empty */
      EmptyStateIndicator: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.func,
      ]),

      List: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
      onSelect: PropTypes.func,

      /** Function that overrides default behaviour when users gets added to a channel */
      onAddedToChannel: PropTypes.func,
      /** Function that overrides default behaviour when users gets removed from a channel */
      onRemovedFromChannel: PropTypes.func,

      /** Object containing query filters */
      filters: PropTypes.object,
      /** Object containing query options */
      options: PropTypes.object,
      /** Object containing sort parameters */
      sort: PropTypes.object,
      /** For flatlist  */
      loadMoreThreshold: PropTypes.number,
    };

    static defaultProps = {
      Preview: ChannelPreviewMessenger,
      List: ChannelListMessenger,
      LoadingIndicator,
      LoadingErrorIndicator,
      EmptyStateIndicator,
      hasNextPage: true,
      filters: {},
      options: {},
      sort: {},
      // https://github.com/facebook/react-native/blob/a7a7970e543959e9db5281914d5f132beb01db8d/Libraries/Lists/VirtualizedList.js#L466
      loadMoreThreshold: 2,
    };

    constructor(props) {
      super(props);
      this.state = {
        error: false,
        loading: true,
        channels: Immutable([]),
        channelIds: Immutable([]),
        loadingChannels: true,
        refreshing: false,
        offset: 0,
      };

      this.menuButton = React.createRef();

      this._queryChannelsDebounced = debounce(this.queryChannels, 1000, {
        leading: true,
        trailing: true,
      });
      this.queryActive = false;
      this._unmounted = false;
    }

    isPromise = (thing) => {
      const promise = thing && typeof thing.then === 'function';
      return promise;
    };

    async componentDidMount() {
      await this._queryChannelsDebounced();
      this.listenToChanges();
    }

    componentWillUnmount() {
      this._unmounted = true;
      this.props.client.off(this.handleEvent);
      this._queryChannelsDebounced.cancel();
    }

    static getDerivedStateFromError() {
      return { error: true };
    }

    componentDidCatch(error, info) {
      console.warn(error, info);
    }

    clickCreateChannel = (e) => {
      this.props.setChannelStart();
      e.target.blur();
    };

    closeMenu = () => {
      this.menuButton.current.checked = false;
    };

    queryChannels = async (resync = false) => {
      // Don't query again if query is already active.
      if (this.queryActive) return;

      this.queryActive = true;

      if (this._unmounted) {
        this.queryActive = false;
        return;
      }
      const { options, filters, sort } = this.props;
      let offset;

      if (resync) {
        offset = 0;
        options.limit = this.state.channels.length;
        if (this._unmounted) return;
        this.setState({
          offset: 0,
        });
      } else {
        offset = this.state.offset;
      }

      if (this._unmounted) return;
      this.setState({ refreshing: true });

      const channelPromise = this.props.client.queryChannels(filters, sort, {
        ...options,
        offset,
      });

      try {
        let channelQueryResponse = channelPromise;
        if (isPromise(channelQueryResponse)) {
          channelQueryResponse = await channelPromise;
          if (offset === 0 && channelQueryResponse.length >= 1) {
            if (this._unmounted) return;
            this.props.setActiveChannel(channelQueryResponse[0]);
          }
        }

        if (this._unmounted) return;
        await this.setState((prevState) => {
          let channels;
          let channelIds;

          if (resync) {
            channels = [...channelQueryResponse];
            channelIds = [...channelQueryResponse.map((c) => c.id)];
          } else {
            // Remove duplicate channels in worse case we get repeted channel from backend.
            channelQueryResponse = channelQueryResponse.filter(
              (c) => this.state.channelIds.indexOf(c.id) === -1,
            );

            channels = [...prevState.channels, ...channelQueryResponse];
            channelIds = [
              ...prevState.channelIds,
              ...channelQueryResponse.map((c) => c.id),
            ];
          }

          return {
            channels, // not unique somehow needs more checking
            channelIds,
            loadingChannels: false,
            offset: channels.length,
            hasNextPage:
              channelQueryResponse.length >= options.limit ? true : false,
            refreshing: false,
          };
        });
      } catch (e) {
        console.warn(e);

        if (this._unmounted) return;
        this.setState({ error: true, refreshing: false });
      }
      this.queryActive = false;
    };

    listenToChanges() {
      this.props.client.on(this.handleEvent);
    }

    handleEvent = async (e) => {
      if (e.type === 'user.presence.changed') {
        let newChannels = this.state.channels;

        newChannels = newChannels.map((channel) => {
          if (!channel.state.members[e.user.id]) return channel;

          channel.state.members.setIn([e.user.id, 'user'], e.user);

          return channel;
        });

        this.setState({ channels: [...newChannels] });
      }

      if (e.type === 'message.new') {
        this.moveChannelUp(e.cid);
      }

      // make sure to re-render the channel list after connection is recovered
      if (e.type === 'connection.recovered') {
        this.queryChannels(true);
      }

      // move channel to start
      if (e.type === 'notification.message_new') {
        // if new message, put move channel up
        // get channel if not in state currently
        const channel = await this.getChannel(e.channel.type, e.channel.id);
        this.moveChannelUp(e.cid);

        // move channel to starting position
        if (this._unmounted) return;
        this.setState((prevState) => ({
          channels: uniqBy([channel, ...prevState.channels], 'cid'),
          channelIds: uniqWith([channel.id, ...prevState.channelIds], isEqual),
          offset: prevState.offset + 1,
        }));
      }

      // add to channel
      if (e.type === 'notification.added_to_channel') {
        if (
          this.props.onAddedToChannel &&
          typeof this.props.onAddedToChannel === 'function'
        ) {
          this.props.onAddedToChannel(e);
        } else {
          const channel = await this.getChannel(e.channel.type, e.channel.id);

          if (this._unmounted) return;
          this.setState((prevState) => ({
            channels: uniqBy([channel, ...prevState.channels], 'cid'),
            channelIds: uniqWith(
              [channel.id, ...prevState.channelIds],
              isEqual,
            ),
            offset: prevState.offset + 1,
          }));
        }
      }

      // remove from channel
      if (e.type === 'notification.removed_from_channel') {
        if (
          this.props.onRemovedFromChannel &&
          typeof this.props.onRemovedFromChannel === 'function'
        ) {
          this.props.onRemovedFromChannel(e);
        } else {
          if (this._unmounted) return;
          this.setState((prevState) => {
            const channels = prevState.channels.filter(
              (channel) => channel.cid !== e.channel.cid,
            );
            const channelIds = prevState.channelIds.filter(
              (cid) => cid !== e.channel.cid,
            );
            return {
              channels,
              channelIds,
            };
          });
        }
      }

      return null;
    };

    getChannel = async (type, id) => {
      const channel = this.props.client.channel(type, id);
      await channel.watch();
      return channel;
    };

    moveChannelUp = (cid) => {
      if (this._unmounted) return;
      const channels = this.state.channels;

      // get channel index
      const channelIndex = this.state.channels.findIndex(
        (channel) => channel.cid === cid,
      );
      if (channelIndex === 0) return;

      // get channel from channels
      const channel = channels[channelIndex];

      //remove channel from current position
      channels.splice(channelIndex, 1);
      //add channel at the start
      channels.unshift(channel);

      // set new channel state
      if (this._unmounted) return;
      this.setState({
        channels: [...channels],
      });
    };

    loadNextPage = () => {
      this._queryChannelsDebounced();
    };

    render() {
      const context = {
        clickCreateChannel: this.clickCreateChannel,
        closeMenu: this.closeMenu,
        loadNextPage: this.loadNextPage,
      };
      const List = this.props.List;
      const props = { ...this.props, setActiveChannel: this.props.onSelect };

      return (
        <React.Fragment>
          <List {...props} {...this.state} {...context} />
        </React.Fragment>
      );
    }
  },
);

export { ChannelList };
