import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { addAudioLevelListener } from 'whisper.rn/src/index';

const MIN_HEIGHT = 10;
const MAX_HEIGHT = 70;
const ANIMATION_CONFIG = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

const AudioVisualizer = () => {
  const barsRef = useRef(
    Array.from({ length: 9 }, () => ({
      sv: useSharedValue(0),
    })),
  );

  useEffect(() => {
    const sub = addAudioLevelListener((bands: number[]) => {
      const b1 = normalize(bands[0]);
      const b2 = normalize(bands[1]);
      const b3 = normalize(bands[2]);
      const b4 = normalize(bands[3]);
      const b5 = normalize(bands[4]);

      const bars = barsRef.current;

      bars[0].sv.value = withTiming(b5, ANIMATION_CONFIG);
      bars[1].sv.value = withTiming(b4, ANIMATION_CONFIG);
      bars[2].sv.value = withTiming(b3, ANIMATION_CONFIG);
      bars[3].sv.value = withTiming(b2, ANIMATION_CONFIG);
      bars[4].sv.value = withTiming(b1, ANIMATION_CONFIG);
      bars[5].sv.value = withTiming(b2, ANIMATION_CONFIG);
      bars[6].sv.value = withTiming(b3, ANIMATION_CONFIG);
      bars[7].sv.value = withTiming(b4, ANIMATION_CONFIG);
      bars[8].sv.value = withTiming(b5, ANIMATION_CONFIG);
    });

    return () => sub?.remove();
  }, []);

  return (
    <View style={styles.container}>
      {barsRef.current.map((bar, i) => (
        <Bar key={i} sharedValue={bar.sv} />
      ))}
    </View>
  );
};

const Bar = React.memo(({ sharedValue }: any) => {
  const animatedStyle = useAnimatedStyle(() => ({
    height: sharedValue.value,
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
});

const normalize = (value: number) => {
  return Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, value * 25));
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: MAX_HEIGHT,
    marginTop: 5,
  },
  bar: {
    width: 10,
    marginHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 5,
  },
});

export default AudioVisualizer;
