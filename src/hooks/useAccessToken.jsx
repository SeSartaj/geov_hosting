import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import { useContext } from 'react';

export default function useAccessToken() {
  const context = useContext(AccessTokenContext);

  if (!context) {
    throw new Error(
      'useAccessToken must be used within an AccessTokenProvider'
    );
  }

  return context;
}
