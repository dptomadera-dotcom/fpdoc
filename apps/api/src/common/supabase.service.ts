import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private storageClient: SupabaseClient;
  private adminClient: SupabaseClient;

  onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      this.logger.warn('Supabase credentials missing. Storage will be mocked.');
      return;
    }

    this.storageClient = createClient(supabaseUrl, supabaseAnonKey);
    this.logger.log('Supabase anon client initialized.');

    if (supabaseServiceKey) {
      this.adminClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      this.logger.log('Supabase admin (service_role) client initialized.');
    } else {
      this.logger.warn('SUPABASE_SERVICE_ROLE_KEY missing – per-user LLM settings will not be available.');
    }
  }

  // ── Storage (bucket) ──────────────────────────────────────────

  async uploadFile(bucketName: string, path: string, file: Buffer, contentType: string) {
    if (!this.storageClient) {
      this.logger.log(`[Mock Storage] Uploading ${path} to ${bucketName}`);
      return `https://mock-supabase.co/storage/v1/object/public/${bucketName}/${path}`;
    }

    const { data, error } = await this.storageClient.storage
      .from(bucketName)
      .upload(path, file, { contentType, upsert: true });

    if (error) throw error;

    const { data: publicData } = this.storageClient.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }

  // ── LLM settings (service_role, bypasses RLS) ─────────────────

  async getUserLlmSettings(userId: string): Promise<{
    provider: string;
    api_key?: string;
    endpoint?: string;
    model?: string;
  } | null> {
    if (!this.adminClient) return null;

    const { data, error } = await this.adminClient
      .from('user_llm_settings')
      .select('provider, api_key, endpoint, model')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      this.logger.error('Error reading user LLM settings:', error.message);
      return null;
    }

    return data;
  }
}
