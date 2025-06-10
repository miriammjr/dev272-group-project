import { useState } from 'react';
import { supabase } from '../utils/supabase';

export function useAddTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<any>(null);

  const addTask = async (taskData: { title: string; completed?: boolean }) => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('TaskList')
      .insert([taskData])
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
