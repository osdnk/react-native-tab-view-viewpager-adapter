# React Native Tab View ViewPager Adapter
This library is an adapter that allows for utilizing [React Native ViewPager](https://github.com/react-native-community/react-native-viewpager) in  [React Native Tab View](https://github.com/react-native-community/react-native-tab-view). With this package, you can replace existing pager responsible for scrolling experience with a purely native one.

## Motivation
[React Native ViewPager](https://github.com/react-native-community/react-native-viewpager) under the hood uses native `UIViewPagerController` on iOS and `ViewPager` on Android. Although it's not that customizable as [React Native Tab View's](https://github.com/react-native-community/react-native-tab-view) Pager built with [Reanimated](https://github.com/kmagiera/react-native-reanimated) and [Gesture Handler](https://github.com/kmagiera/react-native-gesture-handler), it can deliver a bit better native feeling and expose some options not available in TabView by default.

## Usage
```jsx harmony
import React, { useState } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';

<TabView
  renderScene={() => {/* render */}}
  renderTabBar={() => null}
  renderPager={props => (
    <ViewPagerAdapter {...props} transition="curl" showPageIndicator />
  )}
/>

```

## Props
`ViewPagerAdapter` accepts a set of props needed for adapting to Internal API of [React Native Tab View](https://github.com/react-native-community/react-native-tab-view) and are not described here neither supposed to be used.

However, there are few more additional props:

|Prop|Description|Platform|
|-|:-----:|:---:|
|`style: Style`|Style to apply to ViewPager|both
|`pageMargin: number`|Blank space to be shown between pages|both
|`orientation: Orientation`|Set `horizontal` or `vertical` scrolling orientation (it does **not** work dynamically)|both
|`transition: string `|Use `scroll` or `curl` to change transition style (it does **not** work dynamically)|iOS
|`showPageIndicator: boolean`|Shows the dots indicator at the bottom of the view|iOS
|`overdrag: boolean`|Allows for overscrolling after reaching the end or very beginning of pages|iOS

You can find more resources in [React Native ViewPager documentation](https://github.com/react-native-community/react-native-viewpager)

## Usage with React Navigation < 5

```jsx harmony
const SwipeStack = createMaterialTopTabNavigator(
  {
    A: {
      name: 'A screen',
      screen: ScreenA,
    },
    B: {
      name: 'B screen',
      screen: ScreenB,
    },
  },
  {
    pagerComponent: ViewPagerAdapter
  }
);
```

## Usage with React Navigation 5


```jsx harmony
const MaterialTopTabs = createMaterialTopTabNavigator<MaterialTopTabParams>();

export default function MaterialTopTabsScreen() {
  return (
    <MaterialTopTabs.Navigator
      pager={props => <ViewPagerAdapter {...props} />}
    >
      <MaterialTopTabs.Screen
        name="A"
        component={ScreenA}
        options={{ title: 'Chat' }}
      />
      <MaterialTopTabs.Screen
        name="contacts"
        component={ScreenB}
        options={{ title: 'Contacts' }}
      />
    </MaterialTopTabs.Navigator>
  );
}
```

## Installation
```
yarn add react-native-tab-view-viewpager-adapter
```
Also, you need to set up [React Native View Pager](https://github.com/react-native-community/react-native-viewpager)

## Note
`renderPager` prop in [React Native Tab View](https://github.com/react-native-community/react-native-tab-view) is available only from version [2.11.0](https://github.com/react-native-community/react-native-tab-view/commit/429fab86b66ad19dd3a76d4c460e62e15e9f9535)

## Example
We created a React Native example which can be run with following commands:

```bash
cd example
react-native run-android
```

or 
```bash
cd example
cd ios
pod install
cd ..
react-native run-ios
```
