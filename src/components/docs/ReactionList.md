```js
const View = require('react-native').View;

const props = {
  position: 'right',
  visible: true,
  latestReactions: [
    {
      message_id: 'billowing-firefly-8-52540509-ed51-476e-8b6b-e8929aba9e33',
      user_id: 'bender',
      user: {
        id: 'bender',
        role: 'user',
        created_at: '2019-08-26T10:49:19.667963Z',
        updated_at: '2020-01-06T08:42:44.106042Z',
        last_active: '2020-01-06T08:42:44.097139Z',
        banned: false,
        online: false,
        name: 'Bender',
        image: 'https://bit.ly/321RmWb',
      },
      type: 'sad',
      score: 1,
      created_at: '2019-11-28T11:14:20.155817Z',
      updated_at: '2019-11-28T11:14:20.155817Z',
    },
    {
      message_id: 'billowing-firefly-8-52540509-ed51-476e-8b6b-e8929aba9e33',
      user_id: 'bender',
      user: {
        id: 'bender',
        role: 'user',
        created_at: '2019-08-26T10:49:19.667963Z',
        updated_at: '2020-01-06T08:42:44.106042Z',
        last_active: '2020-01-06T08:42:44.097139Z',
        banned: false,
        online: false,
        image: 'https://bit.ly/321RmWb',
        name: 'Bender',
      },
      type: 'haha',
      score: 1,
      created_at: '2019-11-28T11:13:54.845187Z',
      updated_at: '2019-11-28T11:13:54.845187Z',
    },
    {
      message_id: 'billowing-firefly-8-52540509-ed51-476e-8b6b-e8929aba9e33',
      user_id: 'bender',
      user: {
        id: 'bender',
        role: 'user',
        created_at: '2019-08-26T10:49:19.667963Z',
        updated_at: '2020-01-06T08:42:44.106042Z',
        last_active: '2020-01-06T08:42:44.097139Z',
        banned: false,
        online: false,
        image: 'https://bit.ly/321RmWb',
        name: 'Bender',
      },
      type: 'like',
      score: 1,
      created_at: '2019-11-28T10:32:58.981307Z',
      updated_at: '2019-11-28T10:32:58.981307Z',
    },
    {
      message_id: 'billowing-firefly-8-52540509-ed51-476e-8b6b-e8929aba9e33',
      user_id: 'billowing-firefly-8',
      user: {
        id: 'billowing-firefly-8',
        role: 'user',
        created_at: '2019-04-02T13:26:55.274436Z',
        updated_at: '2020-01-06T16:47:25.696327Z',
        last_active: '2020-01-06T16:47:25.692477Z',
        banned: false,
        online: true,
        image:
          'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
        name: 'Billowing firefly',
      },
      type: 'sad',
      score: 1,
      created_at: '2019-11-26T22:32:21.975407Z',
      updated_at: '2019-11-26T22:32:21.975407Z',
    },
    {
      message_id: 'billowing-firefly-8-52540509-ed51-476e-8b6b-e8929aba9e33',
      user_id: 'billowing-firefly-8',
      user: {
        id: 'billowing-firefly-8',
        role: 'user',
        created_at: '2019-04-02T13:26:55.274436Z',
        updated_at: '2020-01-06T16:47:25.696327Z',
        last_active: '2020-01-06T16:47:25.692477Z',
        banned: false,
        online: true,
        image:
          'https://stepupandlive.files.wordpress.com/2014/09/3d-animated-frog-image.jpg',
        name: 'Billowing firefly',
      },
      type: 'like',
      score: 1,
      created_at: '2019-11-26T22:31:51.31847Z',
      updated_at: '2019-11-26T22:31:51.31847Z',
    },
  ],
  getTotalReactionCount: () => 4,
  openReactionSelector: () => {},
  reactionCounts: {
    haha: 1,
    like: 2,
    sad: 2,
  },
};
<View style={{ width: 90 }}>
  <ReactionList {...props} />
</View>;
```
