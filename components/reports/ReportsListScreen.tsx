import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ReportsStackNavigationParams } from '../../navigation/ReportsStack';
import { Plus } from '../shared/Icons';
import { Heading } from '../shared';
import { useTranslation } from 'react-i18next';

interface ReportsListScreenProps {
  navigation: NativeStackNavigationProp<
    ReportsStackNavigationParams,
    'ReportsListScreen'
  >;
}

const ReportsListScreen: FC<ReportsListScreenProps> = () => {
  const { t } = useTranslation();
  return (
    <View>
      <View style={styles.nav}>
        <TouchableOpacity style={styles.createButton}>
          <Plus />
        </TouchableOpacity>
      </View>
      <Heading style={styles.heading} title={t('reports')} />
      <FlatList
        style={{ backgroundColor: 'blue', flex: 1 }}
        data={[]}
        renderItem={() => null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  createButton: {
    alignSelf: 'flex-end',
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    paddingHorizontal: 20,
  },
});

export default ReportsListScreen;
