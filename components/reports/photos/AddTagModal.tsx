import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider, Label, Modal } from '../../shared';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { errorColor1, fontColor2 } from '../../../constants';
import { ReportImageTag, ReportImageTagResponse } from '../../../types';
import { useTags } from './useTags';
import { Tag } from '../../shared/Icons';
import { Loader } from '../../shared/Loader';

interface AddTagModalProps {
  companyId: string;
  existingTags: ReportImageTag[];
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tagId: string) => void;
}

export const AddTagModal: FC<AddTagModalProps> = ({
  companyId,
  existingTags,
  isOpen,
  onClose,
  onAdd,
}) => {
  const { t } = useTranslation();
  const { tags: allTags, loading, error } = useTags(companyId);

  const tags = useMemo(() => {
    return allTags.filter(at => existingTags.some(et => et.tag_id === at.id));
  }, [existingTags, allTags]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(error ? 'error' : 'add_tag')}
      subtitle={t(error ?? 'add_tag_description')}
    >
      <AddTagModalContent
        tags={tags}
        loading={loading}
        hasError={!!error}
        onAdd={onAdd}
        onClose={onClose}
      />
    </Modal>
  );
};

interface AddTagModalContentProps {
  loading: boolean;
  hasError: boolean;
  tags: ReportImageTagResponse[];
  onAdd: (tagId: string) => void;
  onClose: () => void;
}

const AddTagModalContent: FC<AddTagModalContentProps> = ({
  loading,
  hasError,
  tags,
  onAdd,
  onClose,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

  if (hasError) {
    return <Button style={styles.button} label={t('ok')} onPress={onClose} />;
  }

  return (
    <>
      <Divider style={styles.divider} light />
      {!tags.length && (
        <View style={styles.empty}>
          <Label text={t('empty_tags_description')} light />
        </View>
      )}
      {tags.map(tag => (
        <>
          <TouchableOpacity style={styles.tag} onPress={() => onAdd(tag.id)}>
            <View style={styles.icon}>
              <Tag size={26} />
            </View>
            <Label text={tag.name} style={styles.tagName} numberOfLines={1} />
          </TouchableOpacity>
          <Divider light />
        </>
      ))}
    </>
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
  icon: {
    marginRight: 4,
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
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginTop: 24,
  },
  button: {
    marginTop: 24,
  },
});
