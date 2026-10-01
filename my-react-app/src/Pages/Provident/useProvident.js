import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase';
import { calculatePF } from './providentUtils';

export const useProvident = ({ enabled, isAdmin, employeeId }) => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['providentFund', isAdmin ? 'all' : employeeId],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const base = collection(db, 'providentFund');
      const q = isAdmin ? base : query(base, where('employeeId', '==', String(employeeId)));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
  });

  // نحسب كل سجل مرة واحدة (مع fallback لو الحقول ناقصة)
  const rows = useMemo(
    () =>
      data.map((item) => {
        const employeePF = item.employeeContribution ?? calculatePF(item.basicSalary);
        const employerPF = item.employerContribution ?? calculatePF(item.basicSalary);
        const total = item.total ?? employeePF + employerPF;
        return { ...item, employeePF, employerPF, total };
      }),
    [data]
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          employee: acc.employee + (Number(r.employeePF) || 0),
          employer: acc.employer + (Number(r.employerPF) || 0),
          total: acc.total + (Number(r.total) || 0),
        }),
        { employee: 0, employer: 0, total: 0 }
      ),
    [rows]
  );

  return { rows, totals, isLoading };
};