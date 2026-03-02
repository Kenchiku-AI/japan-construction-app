import { createContext, FC, ReactNode, useContext } from 'react';
import { useModalData } from './useModalData';

type ModalState = ReturnType<typeof useModalData>;

// @ts-expect-error
const ModalContext = createContext<ModalState>({});

export const ModalProvider: FC<{ children: ReactNode | ReactNode[] }> = ({
  children,
}) => {
  const modalData = useModalData();

  return (
    <ModalContext.Provider value={modalData}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
