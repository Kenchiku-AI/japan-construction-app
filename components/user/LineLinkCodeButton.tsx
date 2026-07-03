import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { buttonColor, fontColor2 } from "../../constants";
import { Check, Copy } from "../shared/Icons";
import { Button } from "../shared/Button";
import Clipboard from '@react-native-clipboard/clipboard';
import { StyleSheet, Text, View } from "react-native";


interface LineLinkCodeButtonProps {
  code: string;
}

const LineLinkCodeButton: FC<LineLinkCodeButtonProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      {copied ? (
        <View style={styles.messageContainer}>
          <Check color={fontColor2} />
          <Text style={styles.messageText}>
            {t("copied")}
          </Text>
        </View>
      ) : (
        <Button
          variant="tertiary"
          label={`${t("copy_line_link_code")}: ${code}`}
          iconLeft={() => <Copy color={buttonColor} />}
          onPress={async () => {
            try {
              Clipboard.setString(code);

              setCopied(true);

              setTimeout(() => {
                setCopied(false);
              }, 2000);
            } catch (err) {
              console.log("Error copying code:", err);
            }
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    gap: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  messageText: {
    color: fontColor2,
    fontSize: 18
  }
});

export default LineLinkCodeButton;