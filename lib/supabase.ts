import { createClient } from '@supabase/supabase-js'

// `.env.local` 파일에서 환경 변수를 불러옵니다.
// GitHub Pages 등 클라이언트 사이드 빌드 시 환경변수가 번들에 포함되도록 'NEXT_PUBLIC_' 접두사가 필요합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
