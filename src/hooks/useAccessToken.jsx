import { AccessTokenContext } from '@/contexts/AccessTokenProvider';
import { useContext } from 'react';

export default function useAccessToken() {
  return useContext(AccessTokenContext);
}
