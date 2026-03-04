import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// URL이 설정되지 않은 경우 더미 클라이언트를 방지하기 위해 유효성 확인
export const supabase = url.startsWith('http')
  ? createClient(url, key)
  : null;
