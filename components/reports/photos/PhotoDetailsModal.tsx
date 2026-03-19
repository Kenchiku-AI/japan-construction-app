import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal } from '../../shared';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ReportImage } from '../../../types';
import { CachedImage } from '../../shared/CachedImage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tag, Trash } from '../../shared/Icons';
import { errorColor1, fontColor2 } from '../../../constants';
import { useDate } from '../../../services/localization/useDate';

interface PhotoDetailsModalProps {
  image?: ReportImage;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const PhotoDetailsModal: FC<PhotoDetailsModalProps> = ({
  image,
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { formatDate } = useDate();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [isConfirmDeleteShown, setIsConfirmDeleteShown] = useState(false);
  const maxHeight = height - top - bottom - 300;

  const date = useMemo(() => {
    if (!image?.created_at) return null;
    return formatDate(image.created_at);
  }, [image?.created_at]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isConfirmDeleteShown ? t('confirm_delete') : undefined}
      subtitle={
        isConfirmDeleteShown ? t('confirm_delete_photo_description') : undefined
      }
    >
      {isConfirmDeleteShown ? (
        <View style={styles.confirmDeleteButtons}>
          <Button
            label={t('delete_photo')}
            onPress={() => {
              onDelete();

              setTimeout(() => {
                setIsConfirmDeleteShown(false);
              }, 500);
            }}
          />
          <Button
            variant="secondary"
            label={t('cancel')}
            onPress={() => {
              setIsConfirmDeleteShown(false);
            }}
          />
        </View>
      ) : (
        <>
          <View style={styles.image}>
            {image && (
              <CachedImage
                image={image}
                width={width - 64}
                maxHeight={maxHeight}
              />
            )}
          </View>
          {date && (
            <Text style={styles.date}>{t('photo_taken', { date })}</Text>
          )}
          <View style={styles.tags}></View>
          <View style={styles.buttons}>
            <Button
              style={styles.tagButton}
              variant="secondary"
              label={t('add_tag')}
              onPress={() => {}}
              iconLeft={() => <Tag />}
            />
            <Button
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
              variant="secondary"
              label={t('delete_photo')}
              onPress={() => setIsConfirmDeleteShown(true)}
              iconLeft={() => <Trash />}
            />
          </View>
        </>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    gap: 10,
  },
  date: {
    marginTop: 10,
    color: fontColor2,
  },
  buttons: {
    gap: 10,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 5,
    marginLeft: -5,
    marginRight: 5,
  },
  deleteButton: {
    borderColor: errorColor1,
    width: '50%',
  },
  deleteButtonText: {
    color: errorColor1,
  },
  confirmDeleteButtons: {
    gap: 10,
    marginTop: 20,
  },
  tagButton: {
    width: '50%',
  },
  image: {
    alignItems: 'center',
  },
});
