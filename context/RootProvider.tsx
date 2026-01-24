import { FC, ReactNode } from 'react';
import { AuthProvider } from './auth/AuthContext';

const providers = [AuthProvider];

interface ComposeProps {
  components: FC<{ children: ReactNode | ReactNode[] }>[];
  children: ReactNode;
}

const Compose = (props: ComposeProps) => {
  const { components = [], children } = props;
  return components.reduceRight((acc, C) => <C>{acc}</C>, children);
};

const RootProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <Compose components={providers}>{children}</Compose>
);

export default RootProvider;
