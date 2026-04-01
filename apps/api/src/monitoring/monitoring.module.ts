import { Module } from '@nestjs/common';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { SupabaseService } from '../common/supabase.service';

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService, SupabaseService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
