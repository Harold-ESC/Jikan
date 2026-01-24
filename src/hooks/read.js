const { data } = await supabase
  .from('activities')
  .select('*')
  .order('start_time');
    return data;
    