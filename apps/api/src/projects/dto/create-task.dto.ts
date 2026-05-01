import { IsString, IsOptional, IsArray, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CurriculumLinkDto {
  @IsString()
  learningOutcomeId: string;

  @IsOptional()
  @IsString()
  evaluationCriterionId?: string;
}

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  estimatedHours?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CurriculumLinkDto)
  curriculumLinks?: CurriculumLinkDto[];
}
