import { IsString, IsEnum, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EvidenceStatus } from '@prisma/client';

class ScoreItemDto {
  @IsString()
  curriculumLinkId: string;

  @IsNumber()
  score: number;
}

export class CheckEvidenceDto {
  @IsString()
  evidenceId: string;

  @IsEnum(EvidenceStatus)
  status: EvidenceStatus;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreItemDto)
  scores: ScoreItemDto[];
}
