import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  fullName: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toProfile(row: unknown): Profile {
  if (!isRecord(row) || typeof row.id !== 'string' || typeof row.full_name !== 'string') {
    throw new Error('Unexpected profile data.');
  }
  return { id: row.id, fullName: row.full_name };
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error('Could not load your profile.');
  return data ? toProfile(data) : null;
}

export async function updateFullName(userId: string, fullName: string): Promise<void> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', userId)
    .select('id')
    .maybeSingle();

  if (error || !data) throw new Error('Your name could not be updated. Please try again.');
}
