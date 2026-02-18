import { FC } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Divider, Label } from '../shared';
import { Close } from '../shared/Icons';

interface CreateReportScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'CreateReportScreen'
  >;
}

const CreateReportScreen: FC<CreateReportScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: top, ...styles.container }}>
      <View style={styles.nav}>
        <Label text={t('create_report')} size={24} />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Close />
        </TouchableOpacity>
      </View>
      <Divider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
  },
  nav: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  heading: {
    paddingHorizontal: 20,
  },
});

export default CreateReportScreen;
