import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lsdmtltehivookhnjglh.supabase.co';
const supabaseKey = 'sb_publishable_lRP7CzejqqAime2OnrDlMg_WhGEQFoB';

export const supabase = createClient(supabaseUrl, supabaseKey);