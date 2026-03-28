import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Divider, Label, Modal } from '../../shared';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { errorColor1, fontColor1, fontColor2 } from '../../../constants';
import { ReportImageTagResponse } from '../../../types';
import { Tag } from '../../shared/Icons';

interface AddTagModalProps {
  tags: ReportImageTagResponse[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tagId: string) => void;
}

export const AddTagModal: FC<AddTagModalProps> = ({
  tags,
  isOpen,
  onClose,
  onAdd,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add_tag')}
      subtitle={t('add_tag_description')}
    >
      <View style={styles.tags}>
        <Divider light />
        {tags.map(tag => (
          <>
            <TouchableOpacity
              style={styles.tag}
              onPress={() => {
                onAdd(tag.id);
                onClose();
              }}
            >
              <View style={styles.icon}>
                <Tag color={fontColor1} size={26} />
              </View>
              <Label text={tag.name} style={styles.tagName} numberOfLines={1} />
            </TouchableOpacity>
            <Divider light />
          </>
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  icon: {
    marginRight: 8,
  },
  loader: {},
  tag: {
    height: 70,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 16,
  },
  tagName: {
    flexShrink: 1,
  },
  empty: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 24,
  },
  tags: {
    paddingTop: 20,
    paddingBottom: 10,
  },
});
