import React, {
  Dispatch,
  SetStateAction,
  FC,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { View, StyleSheet, ViewStyle, Keyboard } from 'react-native';
import DropdownPicker from 'react-native-dropdown-picker';
import { bgColor2, fontColor1, fontColor2, fontFamily } from '../../constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Label } from './Label';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  setValue: Dispatch<SetStateAction<any>>;
  onOpen?: () => void;
  onClose?: () => void;
  placeholder?: string;
  hideLabel?: boolean;
  forceClose?: boolean;
  error?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Select: FC<SelectProps> = ({
  options,
  value,
  setValue,
  onOpen,
  onClose,
  forceClose,
  placeholder,
  disabled,
  style,
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

  const inputText = useMemo(() => {
    if (!value) return '';
    return options.find(o => o.value === value)?.label ?? '';
  }, [value, options]);

  useEffect(() => {
    if (open) Keyboard.dismiss();
  }, [open]);

  useEffect(() => {
    if (forceClose) {
      setOpen(false);
      onClose?.();
    }
  }, [forceClose]);

  return (
    <View style={style}>
      <View pointerEvents="none" style={styles.labelContainer}>
        {placeholder && (
          <Animated.View style={[styles.label, labelStyle]}>
            <Label text={placeholder} size={12} light />
          </Animated.View>
        )}
        <Animated.View style={[styles.input, inputStyle]}>
          <Label text={inputText} />
        </Animated.View>
      </View>
      <DropdownPicker
        value={value}
        setValue={setValue}
        placeholder={placeholder}
        items={options}
        disabled={disabled}
        open={open}
        setOpen={setOpen}
        onOpen={onOpen}
        onClose={onClose}
        style={{
          borderWidth: 0,
          backgroundColor: bgColor2,
          paddingRight: 16,
          height: 60,
        }}
        labelStyle={{
          opacity: 0,
        }}
        placeholderStyle={{
          color: fontColor2,
          paddingLeft: 10,
        }}
        dropDownContainerStyle={{
          borderWidth: 0,
          backgroundColor: bgColor2,
          paddingLeft: 12,
          paddingRight: 6,
          borderTopWidth: 0.5,
          borderTopColor: fontColor2,
        }}
        textStyle={{
          fontFamily,
          fontSize: 18,
        }}
        listItemContainerStyle={{
          height: 70,
          borderColor: fontColor2,
          borderBottomWidth: 0.5,
          marginLeft: 4,
          marginRight: 10,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    zIndex: 9999,
  },
  inputContainer: {
    height: 60,
    borderRadius: 10,
    justifyContent: 'flex-end',
  },
  input: {
    position: 'absolute',
    left: 20,
    color: fontColor1,
    height: 60,
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    top: 8,
    left: 20,
  },
});
