import { Controller, Get, Post, Query } from '@nestjs/common';
import { NearbyPlacesDto } from './dto/nearby-places.dto';
import { SeedPlacesDto } from './dto/seed-places.dto';
import { PlacesService } from './places.service';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Get('nearby')
  findNearby(@Query() query: NearbyPlacesDto) {
    return this.placesService.findNearby(query);
  }

  @Post('seed')
  seedFromOverpass(@Query() query: SeedPlacesDto) {
    return this.placesService.seedFromOverpass(query);
  }
}
