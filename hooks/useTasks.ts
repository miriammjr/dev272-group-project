import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setError('Failed to get user');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('TaskList')
      .select('*')
      .eq('idUserAccount', user.id); // Filter by user ID

    if (error) {
      setError(error.message);
    } else {
      setTasks(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, refetch: fetchTasks };
};
