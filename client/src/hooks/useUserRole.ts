import { useAuth } from '@clerk/clerk-react';
import { UserRole } from '../../../sharedTypes';
import { useQuery } from '@tanstack/react-query';
import { authenticatedGet } from '../axios';
import { useNavigate } from 'react-router-dom';
import { QueryKey } from '../constants';

export default function useUserRole() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
    queryKey: [QueryKey.USER_ROLE],
    queryFn: async () =>
      authenticatedGet<{ role: UserRole | null }>(
        '/role',
        (await getToken()) ?? '',
        navigate,
      ),
  });

  const returnObj: {
    loading: boolean;
    role: UserRole | null;
    error: Error | null;
  } = {
    loading: true,
    role: null,
    error: null,
  };

  if (isPending || !data) return returnObj; // still loading

  returnObj.loading = false;
  returnObj.role = data.data.role;
  returnObj.error = error;
  return returnObj;
}
