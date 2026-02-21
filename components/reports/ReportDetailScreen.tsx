import { FC, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useAuthContext } from '../../context/auth/AuthContext';
import { useTranslation } from 'react-i18next';
import { ReportFieldValues } from '../../types';
import { useReport } from './useReport';
import { Button, Divider, Input, Label } from '../shared';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bgColor1, buttonColor, errorColor1 } from '../../constants';
import { ChevronLeft, Microphone } from '../shared/Icons';
import { useFade } from '../../context/fade/FadeContext';

interface ReportDetailScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportDetailScreen'
  >;
  route: RouteProp<ReportsStackNavigationParams, 'ReportDetailScreen'>;
}

const ReportDetailScreen: FC<ReportDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { reportId, reportName } = route.params;
  const { setIsFadeShown } = useFade();
  const { top } = useSafeAreaInsets();
  const { report, updateReport, loading, isProcessingAudio } =
    useReport(reportId);
  const { t } = useTranslation();
  const [fieldValues, setFieldValues] = useState<ReportFieldValues>();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(reportName);
  const [displayName, setDisplayName] = useState(reportName);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speakingFadeOpacity = useSharedValue(0);
  const updateButtonHeight = useSharedValue(0);
  const updateButtonOpacity = useSharedValue(0);

  const speakingFadeStyle = useAnimatedStyle(() => ({
    opacity: speakingFadeOpacity.value,
  }));

  const updateButtonStyle = useAnimatedStyle(() => ({
    height: updateButtonHeight.value,
    opacity: updateButtonOpacity.value,
    overflow: 'hidden',
  }));

  useEffect(() => {
    const newValues: ReportFieldValues = {};

    report?.fields.forEach(f => {
      newValues[f.id] = f.value;
    });

    setFieldValues(newValues);
  }, [report]);

  const isUpdateDisabled = useMemo(() => {
    if (!fieldValues || !report || isSpeaking || isProcessingAudio) return true;

    return !report.fields.some(f => f.value !== fieldValues[f.id]);
  }, [report, fieldValues, isSpeaking, isProcessingAudio]);

  useEffect(() => {
    updateButtonHeight.value = withTiming(isUpdateDisabled ? 0 : 70, {
      duration: 200,
    });
    updateButtonOpacity.value = withTiming(isUpdateDisabled ? 0 : 1, {
      duration: 200,
    });
  }, [isUpdateDisabled]);

  const speakButtonLabel = useMemo(() => {
    if (isSpeaking) return t('done');
    if (isProcessingAudio) return t('processing');
    return t('speak_to_edit');
  }, [isSpeaking, isProcessingAudio, t]);

  return (
    <>
      <View style={{ ...styles.container, paddingTop: top }}>
        <View style={styles.navContainer}>
          <View style={styles.nav}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeft color={buttonColor} size={18} />
            </TouchableOpacity>
            {isEditingName ? (
              <Input placeholder={t('report_name')} value={editedName} />
            ) : (
              <Label text={displayName} size={24} />
            )}
          </View>
          <Divider />
        </View>
        <FlatList
          data={report?.fields ?? []}
          renderItem={({ item, index }) => {
            return (
              <Input
                // key={item.id}
                key={`${index}`}
                placeholder={item.name}
                defaultValue={item.value}
                onChange={value => {
                  setFieldValues(prev => {
                    const newValues = { ...prev };
                    newValues[item.id] = value;
                    return newValues;
                  });
                }}
              />
            );
          }}
          contentContainerStyle={styles.fields}
        />
        <View style={styles.buttons}>
          <Animated.View style={updateButtonStyle}>
            <View style={styles.updateButtonContainer}>
              <Button
                label={t('update_report')}
                onPress={() => {}}
                disabled={isUpdateDisabled}
                style={styles.updateButton}
              />
            </View>
          </Animated.View>
          <View style={styles.speakButtonConatiner}>
            <Button
              style={styles.speakButton}
              label={speakButtonLabel}
              iconLeft={() =>
                isProcessingAudio || isSpeaking ? undefined : <Microphone />
              }
              onPress={() => {
                Keyboard.dismiss();
                setIsFadeShown(!isSpeaking);
                speakingFadeOpacity.value = withTiming(isSpeaking ? 0 : 0.5, {
                  duration: 200,
                });
                setIsSpeaking(!isSpeaking);
              }}
              disabled={isProcessingAudio}
            />
          </View>
        </View>
      </View>
      <Animated.View
        style={[styles.speakingFade, speakingFadeStyle]}
        pointerEvents={isSpeaking ? undefined : 'none'}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navContainer: {
    paddingHorizontal: 16,
  },
  nav: {
    height: 70,
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    width: 32,
  },
  fields: {
    gap: 10,
    padding: 16,
  },
  buttons: {
    paddingTop: 6,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  speakButtonConatiner: {
    paddingTop: 10,
  },
  speakButton: {
    borderRadius: 30,
    backgroundColor: errorColor1,
    zIndex: 3000,
  },
  updateButtonContainer: {
    paddingTop: 10,
  },
  updateButton: {
    opacity: 1,
  },
  speakingFade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.5,
    zIndex: 200,
  },
});

export default ReportDetailScreen;
