import { supabase } from './supabase';

// Since we are moving to Supabase, we emulate the old fs behavior 
// by storing the exact same JSON object in a table called "json_store"
// with id = 'data.json' and a 'data' jsonb column.

export const readDb = async () => {
  try {
    const { data, error } = await supabase
      .from('json_store')
      .select('data')
      .eq('id', 'data.json')
      .single();

    if (error || !data) {
      // Return empty state if missing
      return { bookings: [] };
    }
    return data.data;
  } catch (err) {
    console.error('Error reading from Supabase:', err);
    return { bookings: [] };
  }
};

export const writeDb = async (newData) => {
  try {
    const { error } = await supabase
      .from('json_store')
      .upsert({ id: 'data.json', data: newData });

    if (error) {
      console.error('Error writing to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error writing to Supabase:', err);
    return false;
  }
};
