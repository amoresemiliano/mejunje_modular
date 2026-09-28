/**
 * @mejunje/config
 * Shared configuration helpers and environment validation.
 */

export interface SupabaseEnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

/**
 * Reads Supabase environment variables safely from process.env.
 */
export function getSupabaseEnv(): SupabaseEnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return { supabaseUrl, supabaseAnonKey };
}

/**
 * Validates that all required Supabase client variables are present.
 */
export function validateSupabaseEnv(config?: Partial<SupabaseEnvConfig>): {
  valid: boolean;
  missing: string[];
} {
  const cfg = config || getSupabaseEnv();
  const missing: string[] = [];

  if (!cfg.supabaseUrl || cfg.supabaseUrl.trim() === '') {
    missing.push('NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!cfg.supabaseAnonKey || cfg.supabaseAnonKey.trim() === '') {
    missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
