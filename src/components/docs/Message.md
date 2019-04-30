The Message component is the high level component that deals with all the message logic.
It doesn't implement any rendering, but delegates that to the Message prop.

The Message component provides the following functions to the rendered component:

- isMyMessage
- isAdmin
- canEditMessage
- canDeleteMessage
- handleFlag
- handleMute
- handleEdit
- handleDelete
- handleReaction
- handleAction
- handleRetry
- openThread

```js
const data = require('./data');
<div className="str-chat" style={{ height: 'unset' }}>
  <Message
    message={data.message}
    Message={MessageSimple}
    readBy={[]}
    groupStyles={['top']}
    editing={false}
    {...data.channelContext}
  />
</div>;
```

Use the team messaging render component and set readBy

```js
const data = require('./data');

const readBy = [
  {
    created_at: '2019-03-11T15:13:05.441436Z',
    id: 'Jaapusenameinsteadplz',
    image:
      'https://www.gettyimages.com/gi-resources/images/CreativeLandingPage/HP_Sept_24_2018/CR3_GettyImages-159018836.jpg',
    last_active: '2019-04-02T11:11:13.188618462Z',
    name: 'Jaap',
    online: true,
    updated_at: '2019-04-02T11:11:09.36867Z',
  },
];

<Message
  message={data.message}
  Message={MessageTeam}
  readBy={readBy}
  groupStyles={['bottom']}
  editing={false}
  {...data.channelContext}
/>;
```
