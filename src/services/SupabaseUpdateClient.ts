import { supabase } from './supabase';

export interface AppRelease {
    id: string;
    platform: string;
    version: string;
    force_update: boolean;
    apk_urls: Record<string, string>;
    release_notes: string | null;
    published_at: string;
}

export interface FetchReleaseResult {
    release: AppRelease | null;
    error: string | null;
}

/**
 * Supabase client for fetching app release metadata
 */
export class SupabaseUpdateClient {
    /**
     * Fetch the latest Android release from Supabase
     */
    static async fetchLatestRelease(): Promise<FetchReleaseResult> {
        try {
            const { data, error } = await supabase
                .from('app_releases')
                .select('*')
                .eq('platform', 'android')
                .order('published_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                console.error('[SupabaseUpdateClient] Error fetching release:', error);
                return {
                    release: null,
                    error: error.message || 'Failed to fetch release metadata',
                };
            }

            if (!data) {
                return {
                    release: null,
                    error: 'No releases found',
                };
            }

            // Validate release data
            if (!data.version || !data.apk_urls) {
                return {
                    release: null,
                    error: 'Invalid release data: missing version or apk_urls',
                };
            }

            console.log('[SupabaseUpdateClient] Fetched release:', data.version);
            return {
                release: data as AppRelease,
                error: null,
            };
        } catch (error) {
            console.error('[SupabaseUpdateClient] Unexpected error:', error);
            return {
                release: null,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    /**
     * Test connection to Supabase
     */
    static async testConnection(): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('app_releases')
                .select('id')
                .limit(1);

            return !error;
        } catch (error) {
            console.error('[SupabaseUpdateClient] Connection test failed:', error);
            return false;
        }
    }
}
