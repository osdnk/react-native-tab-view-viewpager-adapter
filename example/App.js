import React, { useState } from 'react';
import { TabView, SceneMap } from 'react-native-tab-view';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import { View, Text, StyleSheet } from 'react-native';

function Screen({ id }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        },
      ]}
    >
      <Text style={{ fontSize: 20 }}>{id}</Text>
    </View>
  );
}

export default function MyPager() {
  const [navigation, setNavigation] = useState({
    index: 0,
    routes: [
      {
        key: 1,
      },
      {
        key: 2,
      },
      {
        key: 3,
      },
    ],
  });

  const renderScene = SceneMap({
    1: () => <Screen id="1" />,
    2: () => <Screen id="2" />,
    3: () => <Screen id="3" />,
  });

  return (
    <TabView
      navigationState={navigation}
      renderScene={renderScene}
      renderTabBar={() => null}
      onIndexChange={index => {
        setNavigation({ ...navigation, index: index });
      }}
      renderPager={props => (
        <ViewPagerAdapter {...props} transitionStyle="curl" showPageIndicator />
      )}
    />
  );
}
