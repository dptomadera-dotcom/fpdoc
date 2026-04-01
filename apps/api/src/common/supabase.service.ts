import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  onModuleInit() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials missing. Storage will be mocked.');
      return;
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized for storage.');
  }

  async uploadFile(bucketName: string, path: string, file: Buffer, contentType: string) {
    if (!this.client) {
      console.log(`[Mock Storage] Uploading ${path} to ${bucketName}`);
      return `https://mock-supabase.co/storage/v1/object/public/${bucketName}/${path}`;
    }

    const { data, error } = await this.client.storage
      .from(bucketName)
      .upload(path, file, {
        contentType,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: publicData } = this.client.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }
}
