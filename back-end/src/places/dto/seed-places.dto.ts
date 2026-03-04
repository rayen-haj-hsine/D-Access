import { Transform } from 'class-transformer';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class SeedPlacesDto {
  @Transform(({ value }) => Number(value))
  @IsLatitude()
  lat: number;

  @Transform(({ value }) => Number(value))
  @IsLongitude()
  lon: number;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 2500 : Number(value)))
  @IsInt()
  @Min(250)
  @Max(10000)
  radius?: number;
}
