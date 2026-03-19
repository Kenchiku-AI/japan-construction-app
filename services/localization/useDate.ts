import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

export const useDate = () => {
  const { i18n } = useTranslation();

  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);

      if (i18n.language === 'jp') {
        return dayjs(date).locale('ja').format('M月D日');
      }

      return date.toLocaleDateString();
    },
    [i18n.language],
  );

  return {
    formatDate,
  };
};
