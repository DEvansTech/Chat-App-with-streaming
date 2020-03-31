```js
const View = require('react-native').View;
const data = require('./data');

<Chat client={data.client}>
  <View style={{ width: 90 }}>
    <MessageNotification showNotification={true} onPress={() => {}} />
  </View>
</Chat>
```
