import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';

// الأدمن يجيب الكل، الموظف يجيب مرتباته بس (عشان الـ rules)
export const usePayroll = ({ enabled, isAdmin, employeeId }) =>
  useQuery({
    queryKey: ['payroll', isAdmin ? 'all' : employeeId],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const base = collection(db, 'payroll');
      const q = isAdmin ? base : query(base, where('employeeId', '==', String(employeeId)));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });