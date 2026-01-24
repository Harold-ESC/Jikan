await supabase.from('activities').insert({
  user_id: user.id,
  day_of_week: 'monday',
  start_time: '08:00',
  end_time: '09:00',
  title: 'Trabajo',
  color: '#ff6b6b'
});
    return data;