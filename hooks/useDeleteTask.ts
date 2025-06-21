import { supabase } from '@/utils/supabase';
import { useCallback } from 'react';

export const useDeleteTask = () => {
  const deleteTask = useCallback(async (id: number): Promise<boolean> => {
    console.log('Attempting to delete task with ID:', id);

    const { error } = await supabase.from('TaskList').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete task:', error);
      return false;
    }

    console.log('Task deleted successfully:', id);
    return true;
  }, []);

  return { deleteTask };
};
