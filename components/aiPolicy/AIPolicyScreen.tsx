import { FC } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Divider, Label } from '../shared';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackNavigationParams } from '../../navigation/RootNavigation';
import { fontFamily } from '../../constants';

interface AIPolicyScreenProps {
  navigation: NativeStackNavigationProp<
    RootStackNavigationParams,
    'AIPolicyScreen'
  >;
}

const AIPolicyScreen: FC<AIPolicyScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: top + 20,
        paddingBottom: bottom + 10,
      }}
    >
      <Label text={t('ai_policy_title')} style={styles.title} />
      <Divider />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.text}>
          本アプリでは、現場報告書の作成支援機能を提供するため、音声から変換された文字データおよびアップロードされた画像データをOpenAIのAPIサービスへ送信し、AIによる解析処理を行います。
          {'\n\n'}
          送信されるデータ:{'\n'}
        </Text>

        <View style={{ marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={styles.text}>・</Text>
            <Text style={{ flex: 1, ...styles.text }}>
              音声から変換されたテキストデータ（文字起こし結果）
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text}>・</Text>
            <Text style={{ flex: 1, ...styles.text }}>
              アップロードされた画像データ
            </Text>
          </View>
        </View>

        <Text style={styles.text}>
          {'\n'}
          データの利用目的:{'\n'}
        </Text>

        <View style={{ marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', marginBottom: 4 }}>
            <Text style={styles.text}>・</Text>
            <Text style={{ flex: 1, ...styles.text }}>
              文字起こし結果の整形および報告書作成支援
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.text}>・</Text>
            <Text style={{ flex: 1, ...styles.text }}>
              画像内容の説明生成および報告書への反映
            </Text>
          </View>
        </View>

        <Text style={styles.text}>
          {'\n'}
          送信されたデータは、本アプリの機能提供の目的にのみ使用されます。
          {'\n\n'}
          内容をご確認のうえ、「同意して続行」を押してください。
        </Text>
      </ScrollView>
      <Divider light />
      <Button
        style={styles.button}
        label={t('ai_policy_button')}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
  },
  text: {
    fontFamily,
    fontSize: 16,
    lineHeight: 22,
    includeFontPadding: false
  },
  content: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  button: {
    marginTop: 10,
  },
});

export default AIPolicyScreen;
