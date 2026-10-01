import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export const useEmployees = (enabled = true) =>
  useQuery({
    queryKey: ['employees'],
    enabled,
    staleTime: 10 * 60 * 1000, 
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'employees'));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });