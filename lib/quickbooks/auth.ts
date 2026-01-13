import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''; // Use service role for backend ops
const supabase = createClient(supabaseUrl, supabaseKey);

export async function storeToken(userId: string, token: any) {
    const { error } = await supabase
        .from('quickbooks_tokens')
        .upsert({
            user_id: userId,
            access_token: token.access_token,
            refresh_token: token.refresh_token,
            realm_id: token.realmId,
            expires_at: new Date(Date.now() + token.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString()
        });

    if (error) {
        console.error('Error storing QB token:', error);
        throw error;
    }
}

export async function getToken(userId: string) {
    const { data, error } = await supabase
        .from('quickbooks_tokens')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) return null;
    return data;
}
