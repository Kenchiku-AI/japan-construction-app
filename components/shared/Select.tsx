import React, {
  Dispatch,
  SetStateAction,
  FC,
  useEffect,
  useState,
} from 'react';
import { View, StyleSheet } from 'react-native';
import DropdownPicker from 'react-native-dropdown-picker';
import { bgColor2, fontColor1, fontColor2, fontFamily } from '../../constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Label } from './Label';
import { SelectArrow } from './Icons';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string | number;
  setValue: Dispatch<SetStateAction<any>>;
  placeholder?: string;
  hideLabel?: boolean;
  error?: boolean;
  disabled?: boolean;
}

export const Select: FC<SelectProps> = ({
  options,
  value,
  setValue,
  placeholder,
  error,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const paddingTop = useSharedValue(0);
  const opacity = useSharedValue(0);

  const labelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const inputStyle = useAnimatedStyle(() => ({
    paddingTop: paddingTop.value,
  }));

  useEffect(() => {
    const showLabel = value && placeholder;

    paddingTop.value = withTiming(showLabel ? 18 : 0, { duration: 75 });
    opacity.value = withTiming(showLabel ? 1 : 0, { duration: 75 });
  }, [value, placeholder]);

  return (
    <View style={styles.container}>
      {placeholder && (
        <Animated.View style={[styles.label, labelStyle]}>
          <Label text={placeholder} size={12} light />
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          inputStyle,
          {
            backgroundColor: error ? '#FF636326' : '#F2F2F3',
            borderBottomLeftRadius: open ? 0 : 10,
            borderBottomRightRadius: open ? 0 : 10,
          },
        ]}
      >
        <DropdownPicker
          value={value}
          setValue={setValue}
          placeholder={placeholder}
          items={options}
          disabled={disabled}
          open={open}
          setOpen={setOpen}
          showArrowIcon={false}
          style={{
            borderWidth: 0,
            backgroundColor: undefined,
            paddingRight: 16,
          }}
          labelStyle={{
            fontFamily,
            color: fontColor1,
            paddingLeft: 10,
          }}
          placeholderStyle={{
            color: fontColor2,
            paddingLeft: 10,
          }}
          dropDownContainerStyle={{
            borderWidth: 0,
            backgroundColor: bgColor2,
            paddingLeft: 12,
            paddingRight: 8,
            minHeight: options.length * 50 + 24,
            paddingTop: 10,
            marginTop: !value ? 6 : -3,
            borderTopWidth: 0.5,
            borderTopColor: fontColor2,
          }}
          textStyle={{
            fontFamily,
            fontSize: 18,
          }}
          listItemContainerStyle={{
            height: 50,
          }}
        />
      </Animated.View>
      <View style={styles.arrow}>
        <SelectArrow />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    position: 'relative',
  },
  inputContainer: {
    justifyContent: 'center',
    height: 60,
    borderRadius: 10,
  },
  input: {},
  label: {
    position: 'absolute',
    top: 8,
    left: 20,
    zIndex: 1,
  },
  arrow: {
    position: 'absolute',
    top: 28,
    right: 24,
  },
});
