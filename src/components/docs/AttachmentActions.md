AttachmentActions renders the attachment action

Style info

```js
function actionHandler(action) {
  console.log(action);
}

const actions = [
  // style can be default, primary or danger
  { name: 'Blue', value: 'blue', style: 'primary', text: 'Blue' },
  { name: 'Green', value: 'green', style: 'default', text: 'Green' },
  { name: 'Orange', value: 'orange', style: 'danger', text: 'Orange' },
];

<AttachmentActions
  id={1}
  text={'Pick a color'}
  actions={actions}
  actionHandler={actionHandler}
/>;
```

```js
const { css } = require('@stream-io/styled-components');

function actionHandler(action) {
  console.log(action);
}

const actions = [
  // style can be default, primary or danger
  { name: 'Black', value: 'black', style: 'primary', text: 'Black' },
  { name: 'Green', value: 'green', style: 'default', text: 'Green' },
  { name: 'Orange', value: 'orange', style: 'danger', text: 'Orange' },
];

<AttachmentActions
  id={1}
  text={'Pick a color'}
  actions={actions}
  actionHandler={actionHandler}
  style={{
    button: { primaryBackgroundColor: 'black' },
    buttonText: {
      css: css`
        font-size: ${(props) => (props.buttonStyle === 'primary' ? 60 : 30)}px;
      `,
    },
  }}
/>;
```
