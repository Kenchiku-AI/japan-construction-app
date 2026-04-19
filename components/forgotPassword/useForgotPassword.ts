import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../services/api/useApi';

type ModalContent = {
  title: string;
  subtitle: string;
};

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const api = useApi();
  const { t } = useTranslation();
  const [modalContent, setModalContent] = useState<ModalContent | undefined>();

  const forgotPassword = useCallback(
    async (email: string) => {
      setLoading(true);

      try {
        await api.forgotPassword({
          email,
        });

        setModalContent({
          title: t('email_sent'),
          subtitle: t('email_sent_description'),
        });
      } catch (err) {
        setModalContent({
          title: t('error'),
          subtitle: t('forgot_password_error_description'),
        });
        console.log('err', err);
      }

      setLoading(false);
    },
    [api],
  );

  return {
    loading,
    forgotPassword,
    modalContent,
    setModalContent,
  };
};
