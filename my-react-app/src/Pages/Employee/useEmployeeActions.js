import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteDoc(doc(db, 'employees', String(id))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
    onError: (e) => {
      console.error(e);
      alert(e.code === 'permission-denied' ? "You don't have permission to delete" : 'Delete failed');
    },
  });
};