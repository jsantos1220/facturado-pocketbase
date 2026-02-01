import { createClient } from '@supabase/supabase-js'
import { Database } from 'src/types/database.types'

//npx supabase gen types typescript --project-id soexbofeymcmsctzadju --schema public > database.types.ts

const supabase = createClient<Database>(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export default supabase
