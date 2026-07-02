import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Modal } from '../shared';
import { Platform, StyleSheet, View } from 'react-native';
import { UpdateProjectRequest, Project } from '../../types';
import { ScrollView } from 'react-native-gesture-handler';

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: UpdateProjectRequest) => void;
}

export const EditProjectModal: FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  useEffect(() => {
    if (isOpen) {
      setName(project.name);
      setDescription(project.description);
    }
  }, [isOpen]);

  return (
    <Modal
      title={t('edit_project')}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ScrollView keyboardDismissMode="interactive">
        <View style={styles.fields}>
          <Input
            placeholder={t('name')}
            value={name}
            onChange={n => {
              setName(n);
            }}
          />
          <Input
            placeholder={t('description')}
            value={description}
            onChange={d => {
              setDescription(d);
            }}
            style={styles.description}
            multiline
          />
        </View>
        <Button
          label={t('update')}
          onPress={() => {
            onSubmit({
              name,
              description,
            });
          }}
          disabled={
            !name ||
            !description ||
            (name === project.name && description === project.description)
          }
        />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fields: {
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  description: {
    height: 120,
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? 0 : 12,
  },
});
