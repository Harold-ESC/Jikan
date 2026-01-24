import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useActivities(user) {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!user) return;

    setLoading(true);

    const { data } = await supabase
      .from('activities')
      .select('*')
      .order('start_time');

    const grouped = {};
    data?.forEach(a => {
      if (!grouped[a.day_of_week]) grouped[a.day_of_week] = [];

      grouped[a.day_of_week].push({
        id: a.id,
        start: parseInt(a.start_time),
        end: parseInt(a.end_time),
        title: a.title,
        description: a.description,
        color: a.color,
      });
    });

    setSchedules(grouped);
    setLoading(false);
  };

  useEffect(() => {
    reload();
  }, [user]);

  return {
    schedules,
    loading,
    reload,
  };
}
