import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useActivities(user) {
  const [schedules, setSchedules] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadActivities = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('start_time');

      if (!error && data) {
        const grouped = {};

        data.forEach(activity => {
          if (!grouped[activity.day_of_week]) {
            grouped[activity.day_of_week] = [];
          }

          grouped[activity.day_of_week].push({
            id: activity.id,
            start: parseInt(activity.start_time.split(':')[0], 10),
            end: parseInt(activity.end_time.split(':')[0], 10),
            title: activity.title,
            description: activity.description,
            color: activity.color,
          });
        });

        setSchedules(grouped);
      }

      setLoading(false);
    };

    loadActivities();
  }, [user]);

  return { schedules, loading };
}
