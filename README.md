# React Native Chat Components

<a href="https://getstream.io/chat/react-native-chat/tutorial/"><img src="https://i.imgur.com/SRkDlFX.png" alt="react native chat" /></a>

> The official React Native and Expo components for Stream Chat, a service for
> building chat applications.

[![NPM](https://img.shields.io/npm/v/stream-chat-react-native.svg)](https://www.npmjs.com/package/stream-chat-react-native)
[![Build Status](https://travis-ci.org/GetStream/stream-chat-react-native.svg?branch=master)](https://travis-ci.org/GetStream/stream-chat-react-native)
[![Component Reference](https://img.shields.io/badge/docs-component%20reference-blue.svg)](https://getstream.github.io/stream-chat-react-native/)

**Quick Links**

- [Stream Chat API](https://getstream.io/chat/) product overview
- [Register](https://getstream.io/chat/trial/) to get an API key for Stream Chat
- [React Native Chat Tutorial](https://getstream.io/chat/react-native-chat/tutorial/)
- [Chat UI Kit](https://getstream.io/chat/ui-kit/)
- [Release Notes](https://github.com/GetStream/stream-chat-react-native/blob/master/CHANGELOG.md)
- [Internationalisation (i18n)](#internationalisation)
- [Cookbook](docs/cookbook.md)  :rocket:


## Contents

- [React Native Chat Tutorial](#react-native-chat-tutorial)
- [Example Apps](#example-apps)
  - [Expo Example](#expo-example)
  - [Native Example](#native-example)
- [Docs](#docs)
- [Keep in mind](#keep-in-mind)
- [Setup](#setup)
  - [Expo package](#expo-package)
  - [Native package](#native-package)
- [Upgrade](#upgrade)
- [Common Issues](#common-issues)
- [Contributing](#contributing)

## React Native Chat Tutorial

The best place to start is the [React Native Chat Tutorial](https://getstream.io/chat/react-native-chat/tutorial/). It teaches you how to use this SDK and also shows how to make common changes.

## Example Apps

This repo includes 2 example apps. One that's used with Expo, and one for native.

### Expo example

1. Make sure node version is >= v10.13.0
2. ```bash
   yarn global add expo-cli
   git clone https://github.com/GetStream/stream-chat-react-native.git
   cd stream-chat-react-native/examples/ExpoMessaging
   yarn && yarn start
   ```

### Native example

1. Please make sure you have installed necessary dependencies depending on your development OS and target OS. Follow the guidelines given on official react native documentation for installing dependencies: https://facebook.github.io/react-native/docs/getting-started#
2. Make sure node version is >= v10.13.0
3. Start the simulator

4. ```bash
   git clone https://github.com/GetStream/stream-chat-react-native.git
   cd stream-chat-react-native/examples/NativeMessaging
   yarn install
   ```
5. - For iOS
     ```bash
     cd ios && pod install && cd ..
     react-native run-ios
     ```
   - For android
     ```bash
     react-native run-android
     ```

   If you run into following error on android:

   ```bash
   Execution failed for task ':app:validateSigningDebug'.
   > Keystore file '/path_to_project/stream-chat-react-native/examples/NativeMessaging/android/app/debug.keystore' not found for signing config 'debug'.
   ```

   You can generate the debug keystore by running this command in the `android/app/` directory: `keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000` - [Reference](https://github.com/facebook/react-native/issues/25629#issuecomment-511209583)

## Docs

The [styleguidist docs for stream-chat-react-native](https://getstream.github.io/stream-chat-react-native/) document how all the components work.

The React Native components are created using the stream-chat-js library. If you're customizing the components it's important to learn how the Chat Server API works. You'll want to review our [JS chat API docs](https://getstream.io/chat/docs/js/).

## Keep in mind

1. Navigation between different component is something we expect consumers to
   implement. You can checkout the example given in this repository

2. Minor releases may come with some breaking changes, so always check the release notes before upgrading minor version.

Library currently exposes following components:

1. Avatar
2. Chat
3. Channel
4. MessageList
5. TypingIndicator
6. MessageInput
7. MessageSimple
8. ChannelList
9. Thread
10. ChannelPreviewMessenger
11. CloseButton
12. IconBadge

You can see detailed documentation about the components at https://getstream.github.io/stream-chat-react-native

## Setup (Setting up an chat app)

### Expo package

```bash
yarn global add expo-cli
# expo-cli supports following Node.js versions:
# * >=8.9.0 <9.0.0 (Maintenance LTS)
# * >=10.13.0 <11.0.0 (Active LTS)
# * >=12.0.0 (Current Release)
expo init StreamChatExpoExample
cd StreamChatExpoExample

# Add chat expo package
yarn add stream-chat-expo

# If you are using stream-chat-expo <= 0.4.0 and expo <= 34, then you don't need to add @react-native-community/netinfo as dependency. Since previously we used use NetInfo from react-native package.
expo install @react-native-community/netinfo expo-document-picker expo-image-picker expo-permissions
```

Please check [Example](https://github.com/GetStream/stream-chat-react-native/blob/master/examples/ExpoMessaging/App.js) to see usage of the components.

OR you can swap [this file](https://github.com/GetStream/stream-chat-react-native/blob/master/examples/ExpoMessaging/App.js) for your `App.js` in the root folder with additional following steps:

```bash
yarn add react-navigation@3.2.1 react-native-gesture-handler react-native-reanimated
```

and finally

```bash
yarn start
```

### Native package:

#### For react native < 0.60

```bash
react-native init StreamChatReactNativeExample
cd StreamChatReactNativeExample
yarn add stream-chat-react-native

# https://github.com/react-native-community/react-native-netinfo#react-native-compatibility
# For React native 0.59.x - use @react-native-community/netinfo@3.2.1
# For React native <= 0.58.x - use @react-native-community/netinfo@2.0.7
yarn add @react-native-community/netinfo@3.2.1

# https://github.com/react-native-community/react-native-image-picker#react-native-compatibility
yarn add react-native-image-picker@0.28.1
yarn add react-native-document-picker

react-native link @react-native-community/netinfo

# if you are planning to use image picker or file picker or both
react-native link react-native-image-picker
react-native link react-native-document-picker

```

Please check [Example](https://github.com/GetStream/stream-chat-react-native/blob/master/examples/NativeMessaging/App.js) to see usage of components.

OR you can swap this file for your `App.js` in root folder with additional following steps:

```bash
yarn add react-navigation@3.11.0
yarn add react-native-gesture-handler@1.3.0 react-native-reanimated
react-native link react-native-gesture-handler
react-native link react-native-reanimated
```

If you are planning to use image picker, there are some additional steps to be done. You can find them here - https://github.com/react-native-community/react-native-image-picker/blob/master/docs/Install.md

If you are planning to use file/document picker, you need to enable iCloud capability in your app - https://github.com/Elyx0/react-native-document-picker#reminder

and finally

```bash
react-native run-ios
```

#### For react native >= 0.60

```bash
react-native init StreamChatReactNativeExample
cd StreamChatReactNativeExample
yarn add stream-chat-react-native
yarn add @react-native-community/netinfo react-native-image-picker react-native-document-picker
cd ios && pod install && cd ..

```

Just to be sure, please verify you are using appropriate version of following packages as per your react-native version.

- netinfo : https://github.com/react-native-community/react-native-netinfo#react-native-compatibility

- react-native-image-picker : https://github.com/react-native-community/react-native-image-picker#react-native-compatibility

Please check [Example](https://github.com/GetStream/stream-chat-react-native/blob/master/examples/NativeMessaging/App.js) to see usage of components.

OR you can swap this file for your `App.js` in root folder with additional following steps:

```bash
yarn add react-navigation@3.11.0
yarn add react-native-gesture-handler react-native-reanimated
cd ios && pod install && cd ..
```

If you are planning to use image picker, there are some additional steps to be done. You can find them here - https://github.com/react-native-community/react-native-image-picker/blob/master/docs/Install.md

If you are planning to use file/document picker, you need to enable iCloud capability in your app - https://github.com/Elyx0/react-native-document-picker#reminder

and finally

**iOS**:

```bash
react-native run-ios
```

**Note for Android**:

If you are using androidx app:

> AndroidX is a major step forward in the Android ecosystem, and the old support library artifacts are being deprecated. For 0.60, React Native has been migrated over to AndroidX. This is a breaking change, and your native code and dependencies will need to be migrated as well.

(reference: https://facebook.github.io/react-native/blog/2019/07/03/version-60#androidx-support)

In current context, dependencies such as `react-native-document-picker` and (if you are using `react-navigation`) `react-native-gesture-handler`, `react-native-reanimated` don't have androidx support. But awesome tool named [jetifier](https://github.com/mikehardy/jetifier) is quite useful to patch these dependencies with androidx support.

**NOTE** If you are planning to use file picker functionality, make sure you enable iCloud capability in your app

![Enable iCloud capability](https://camo.githubusercontent.com/ac300ca7e3bbab573a76c151469a89efd8b31e72/68747470733a2f2f33313365353938373731386233343661616638332d66356538323532373066323961383466373838313432333431303338343334322e73736c2e6366312e7261636b63646e2e636f6d2f313431313932303637342d656e61626c652d69636c6f75642d64726976652e706e67)

## Upgrade

- Upgrade from 0.1.x to 0.2.x:

  - 0.2.x added support for react native 0.60. Dependencies like `react-native-image-picker`, `react-native-document-picker` and `netinfo` have been taken out of hard dependencies and moved to peer dependencies and thus will have to be installed manually on consumer end ([Reference](https://github.com/GetStream/stream-chat-react-native/pull/52/files#diff-83a54d8caab0ea9fcdd5f832b03a5d83))
  - React native 0.60 came with autolinking functionality, that means if some native libraries are linked manually before upgrade, they will have to be unlinked so that react native can autolink them ([Reference](https://facebook.github.io/react-native/blog/2019/07/03/version-60#native-modules-are-now-autolinked))

    ```
    react-native unlink react-native-image-picker
    react-native unlink react-native-document-picker
    react-native unlink @react-native-community/netinfo
    ```

  - React native 0.60 has been migrated over to AndroidX. In current context, dependencies such as `react-native-document-picker` and (if you are using `react-navigation`) `react-native-gesture-handler`, `react-native-reanimated` don't have androidx support. But awesome tool named [jetifier](https://github.com/mikehardy/jetifier) is quite useful to patch these dependencies with androidx support.

  - CocoaPods are not part of React Native's iOS project ([ref](https://facebook.github.io/react-native/blog/2019/07/03/version-60#cocoapods-by-default)). Thus make sure to install all the pod dependencies.

    ```
    cd ios && pod install && cd ..
    ```

## Common issues

#### While running native example, you may (not necessarily) run into following issues:

1. When you execute `react-native run-ios` for the first time, it starts a metro bundler in parallel. It can result into some errors, since build process isn't complete yet. Try the following to fix this:
   1. Close/stop the metro bundler process.
   2. Let the build process finish completely, it can take usually around 2-3 minutes for the first time.
   3. Start the metro bundler manually by executing `yarn start` inside `stream-chat-react-native/examples/NativeMessaging` directory.
2. When you execute `react-native run-android`, you may (not necessarily) run into following error:

   ```ERROR
   info Starting JS server...
   info Building and installing the app on the device (cd android && ./gradlew app:installDebug)...
   Starting a Gradle Daemon, 1 incompatible Daemon could not be reused, use --status for details

   FAILURE: Build failed with an exception.

   * What went wrong:
   A problem occurred configuring project ':@react-native-community_netinfo'.
   > SDK location not found. Define location with sdk.dir in the local.properties file or with an ANDROID_HOME environment variable.

   * Try:
   Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

   * Get more help at https://help.gradle.org

   BUILD FAILED in 13s
   error Could not install the app on the device, read the error above for details.
   Make sure you have an Android emulator running or a device connected and have
   set up your Android development environment:
   https://facebook.github.io/react-native/docs/getting-started.html
   error Command failed: ./gradlew app:installDebug. Run CLI with --verbose flag for more details.
   ```

   To resolve this, do the following

   1. Craete a file named `local.properties` inside `stream-chat-react-native/examples/NativeMessaging/android` directory
   2. Put the this line in that file. Make sure sdk path is correctly mentioned as per your system:
      ```
      sdk.dir=/Users/{user_name}/Library/Android/sdk/
      ```
   3. Rerun `react-native run-android` in `stream-chat-react-native/examples/NativeMessaging` directory

## Internationalisation

Instance of class `Streami18n` should be provided to Chat component to handle translations.
Stream provides following list of in-built translations for components:

1.  English (en)
2.  Dutch (nl)
3.  Russian (ru)
4.  Turkish (tr)
5.  French (fr)
6.  Italian (it)
7.  Hindi (hi)

Default language is English. Simplest way to start using chat components in one of the in-built languages would be following:

Simplest way to start using chat components in one of the in-built languages would be following:

```js static
const i18n = new Streami18n({ language: 'nl' });
<Chat client={chatClient} i18nInstance={i18n}>
  ...
</Chat>;
```

If you would like to override certain keys in in-built translation:

```js static
const i18n = new Streami18n({
  language: 'nl',
  translationsForLanguage: {
    'Nothing yet...': 'Nog Niet ...',
    '{{ firstUser }} and {{ secondUser }} are typing...':
      '{{ firstUser }} en {{ secondUser }} zijn aan het typen...',
  },
});
```

You can find all the available keys here: https://github.com/GetStream/stream-chat-react-native/tree/master/src/i18n

They are also exported as json object from the library.

```js static
import {
  enTranslations,
  nlTranslations,
  ruTranslations,
  trTranslations,
  frTranslations,
  hiTranslations,
  itTranslations,
  esTranslations,
} from 'stream-chat-react-native'; // or 'stream-chat-expo'
```

Please read this docs on i18n for more details and further customizations - https://getstream.github.io/stream-chat-react-native/#streami18n

## Contributing

We welcome code changes that improve this library or fix a problem, please make sure to follow all best practices and test all the changes. Please check our [dev setup docs](https://github.com/GetStream/stream-chat-react-native/wiki/Dev-setup-for-contributing-to-the-library) to get you started. We are very happy to merge your code in the official repository. Make sure to sign our [Contributor License Agreement (CLA)](https://docs.google.com/forms/d/e/1FAIpQLScFKsKkAJI7mhCr7K9rEIOpqIDThrWxuvxnwUq2XkHyG154vQ/viewform) first. See our license file for more details.

