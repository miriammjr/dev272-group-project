import { useState } from 'react';
import { supabase } from '../utils/supabase';

export function useAddTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<any>(null);

  const addTask = async (taskData: { title: string; completed?: boolean }) => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError('User not authenticated');
      setLoading(false);
      return { data: null, error: userError };
    }

    const { data, error } = await supabase
      .from('TaskList')
      .insert([
        {
          ...taskData,
          idUserAccount: user.id, // Attach user ID here
        },
      ])
      .select()
      .single();

    if (error) {
      setError(error.message);
      setNewTask(null);
    } else {
      setNewTask(data);
    }

    setLoading(false);
    return { data, error };
  };

  return { addTask, newTask, loading, error };
}
