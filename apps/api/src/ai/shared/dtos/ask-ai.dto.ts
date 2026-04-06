import { IsString, IsOptional } from 'class-validator';

export class AskAiDto {
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  route?: string;
}

export class SuggestProjectStructureDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  raIds: string[];
  ceIds: string[];

  @IsOptional()
  @IsString()
  route?: string;
}
