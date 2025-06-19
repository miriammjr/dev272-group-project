import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('TaskList').select('*');
    if (error) setError(error.message);
    else setTasks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, refetch: fetchTasks };
}
