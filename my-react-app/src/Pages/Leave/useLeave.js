import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { calculateDays } from './leaveUtils';

export const useLeave = ({ enabled, isAdmin, employeeId }) => {
  const queryClient = useQueryClient();

  const { data: leave = [], isLoading } = useQuery({
    queryKey: ['leave', isAdmin ? 'all' : employeeId],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const base = collection(db, 'leaveRequests');
      const q = isAdmin ? base : query(base, where('employeeId', '==', String(employeeId)));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['leave'] });

  const changeStatus = useMutation({
    mutationFn: ({ id, status }) => updateDoc(doc(db, 'leaveRequests', String(id)), { status }),
    onSuccess: refresh,
    onError: (e) => {
      console.error(e);
      alert(e.code === 'permission-denied' ? "You don't have permission" : 'Something went wrong');
    },
  });

  const createRequest = useMutation({
    mutationFn: (values) =>
      addDoc(collection(db, 'leaveRequests'), {
        ...values,
        employeeId: String(employeeId),
        status: 'Pending',
        days: calculateDays(values.startDate, values.endDate),
        createdAt: serverTimestamp(),
      }),
    onSuccess: refresh,
  });

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0 };
    leave.forEach((l) => {
      const s = l.status?.toLowerCase();
      if (s in c) c[s]++;
    });
    return c;
  }, [leave]);

  return { leave, counts, isLoading, changeStatus, createRequest };
};