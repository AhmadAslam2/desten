import { useQuery } from '@apollo/client';
import { GET_CUSTOMER_DETAILS } from '../api/mutations';
import { useAuth } from '../store/useAuth';

export const useCustomerDetails = () => {
  const accessToken = useAuth(state => state.accessToken);
  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_DETAILS, {
    variables: { customerAccessToken: accessToken },
    skip: !accessToken,
    fetchPolicy: 'network-only',
  });

  return {
    customer: data?.customer,
    loading,
    error,
    refetch,
  };
};
