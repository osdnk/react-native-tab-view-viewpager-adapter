import * as React from 'react';
import { Keyboard, StyleProp, ViewStyle } from 'react-native';
import ViewPager from 'react-native-pager-view';
import Animated from 'react-native-reanimated';

import {
  NavigationState,
  Route,
  Listener,
  PagerCommonProps,
  EventEmitterProps,
} from 'react-native-tab-view/src/types';

const AnimatedViewPager = Animated.createAnimatedComponent(ViewPager);

type Props<T extends Route> = PagerCommonProps & {
  onIndexChange: (index: number) => void;
  navigationState: NavigationState<T>;
  children: (
    props: EventEmitterProps & {
      // Animated value which represents the state of current index
      // It can include fractional digits as it represents the intermediate value
      position: Animated.Node<number>;
      // Function to actually render the content of the pager
      // The parent component takes care of rendering
      render: (children: React.ReactNode) => React.ReactNode;
      // Callback to call when switching the tab
      // The tab switch animation is performed even if the index in state is unchanged
      jumpTo: (key: string) => void;
    }
  ) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  orientation?: 'vertical' | 'horizontal';
  transition?: 'scroll' | 'curl';
  showPageIndicator?: boolean;
  pageMargin?: number;
  overdrag?: boolean;
  overScrollMode?: 'always' | 'never' | 'auto';
};

const { event, add } = Animated;

export default class ViewPagerBackend<T extends Route> extends React.Component<
  Props<T>
> {
  static defaultProps = {
    onIndexChange: () => {},
    swipeEnabled: true,
  };

  componentDidUpdate(prevProps: Props<T>) {
    if (
      prevProps.navigationState.index !== this.props.navigationState.index &&
      !this.justScrolled
    ) {
      this.jumpToIndex(this.props.navigationState.index);
    }
    this.justScrolled = false;
  }

  private enterListeners: Listener[] = [];

  private jumpToIndex = (index: number) => {
    // If the index changed, we need to trigger a tab switch
    // this.isSwipeGesture.setValue(FALSE);
    this.ref.current.getNode().setPage(index);
  };

  private jumpTo = (key: string) => {
    const { navigationState, keyboardDismissMode, onIndexChange } = this.props;
    const index = navigationState.routes.findIndex(
      (route: { key: string }) => route.key === key
    );

    // A tab switch might occur when we're in the middle of a transition
    // In that case, the index might be same as before
    // So we conditionally make the pager to update the position
    if (navigationState.index !== index) {
      onIndexChange(index);
      this.jumpToIndex(index);

      // When the index changes, the focused input will no longer be in current tab
      // So we should dismiss the keyboard
      if (keyboardDismissMode === 'auto') {
        Keyboard.dismiss();
      }
    }
  };

  private addListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter':
        this.enterListeners.push(listener);
        break;
    }
  };

  private removeListener = (type: 'enter', listener: Listener) => {
    switch (type) {
      case 'enter': {
        const index = this.enterListeners.indexOf(listener);

        if (index > -1) {
          this.enterListeners.splice(index, 1);
        }

        break;
      }
    }
  };

  private currentIndex = new Animated.Value(this.props.navigationState.index);
  private offset = new Animated.Value(0);
  private justScrolled = false;

  private onPageScroll = event([
    {
      nativeEvent: {
        position: this.currentIndex,
        offset: this.offset,
      },
    },
  ]);

  onPageScrollStateChanged = (state: 'Idle' | 'Dragging' | 'Settling') => {
    switch (state) {
      case 'Settling':
        this.props.onSwipeEnd && this.props.onSwipeEnd();
        return;
      case 'Dragging':
        this.props.onSwipeStart && this.props.onSwipeStart();
        return;
    }
  };

  private onIndexChange(newPosition: number) {
    if (newPosition !== this.props.navigationState.index) {
      // assuming gesture
      this.justScrolled = true;
    }
    this.props.onIndexChange(newPosition);
  }

  ref = React.createRef<any>();

  render() {
    const {
      style,
      keyboardDismissMode,
      swipeEnabled,
      children,
      orientation,
      transition,
      showPageIndicator,
      pageMargin,
      overdrag,
      overScrollMode,
    } = this.props;

    return children({
      position: add(this.currentIndex, this.offset),
      addListener: this.addListener,
      removeListener: this.removeListener,
      jumpTo: this.jumpTo,
      render: children => (
        <AnimatedViewPager
          ref={this.ref}
          lazy={false}
          style={[{ flex: 1 }, style]}
          initialPage={this.props.navigationState.index}
          keyboardDismissMode={
            // ViewPager does not accept auto mode
            keyboardDismissMode === 'auto' ? 'on-drag' : keyboardDismissMode
          }
          onPageScroll={this.onPageScroll}
          onPageSelected={(e: { nativeEvent: { position: number } }) =>
            this.onIndexChange(e.nativeEvent.position)
          }
          onPageScrollStateChanged={this.onPageScrollStateChanged}
          scrollEnabled={swipeEnabled}
          orientation={orientation}
          transitionStyle={transition}
          showPageIndicator={showPageIndicator}
          pageMargin={pageMargin}
          overdrag={overdrag}
          overScrollMode={overScrollMode}
        >
          {children}
        </AnimatedViewPager>
      ),
    });
  }
}
