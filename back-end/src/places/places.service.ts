import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { NearbyPlacesDto } from './dto/nearby-places.dto';
import { SeedPlacesDto } from './dto/seed-places.dto';
import { Place, PlaceDocument } from './schemas/place.schema';

type OverpassElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type NormalizedPlace = {
  source: 'osm';
  osmType: 'node' | 'way' | 'relation';
  osmId: number;
  sourceId: string;
  name: string;
  category: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  tags: Record<string, string>;
  accessibility: {
    wheelchair: 'yes' | 'no' | 'limited' | 'unknown';
    toiletsWheelchair: 'yes' | 'no' | 'unknown';
  };
  updatedAt: Date;
};

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name)
    private readonly placeModel: Model<PlaceDocument>,
  ) {}

  async findNearby(query: NearbyPlacesDto) {
    const radius = query.radius ?? 3000;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const filter: Record<string, unknown> = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [query.lon, query.lat],
          },
          $maxDistance: radius,
        },
      },
    };

    if (query.category) {
      filter.category = query.category;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.placeModel.find(filter).skip(skip).limit(limit).lean().exec(),
      this.placeModel.countDocuments(filter).exec(),
    ]);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async seedFromOverpass(input: SeedPlacesDto) {
    const radius = input.radius ?? 2500;
    const overpassQuery = `
[out:json][timeout:45];
(
  nwr(around:${radius},${input.lat},${input.lon})[amenity];
  nwr(around:${radius},${input.lat},${input.lon})[shop];
  nwr(around:${radius},${input.lat},${input.lon})[tourism];
  nwr(around:${radius},${input.lat},${input.lon})[leisure];
);
out center tags qt;
`;

    const response = await axios.get<{ elements: OverpassElement[] }>(
      'https://overpass-api.de/api/interpreter',
      {
        params: { data: overpassQuery },
        timeout: 60000,
      },
    );

    const elements = response.data.elements ?? [];
    const normalizedDocs: NormalizedPlace[] = elements
      .map((element) => this.normalizeElement(element))
      .filter((doc): doc is NormalizedPlace => doc !== null);

    const operations = normalizedDocs.map((doc) => ({
      updateOne: {
        filter: { sourceId: doc.sourceId },
        update: { $set: doc },
        upsert: true,
      },
    }));

    if (operations.length === 0) {
      return {
        fetched: elements.length,
        imported: 0,
        message: 'No valid OSM place nodes with coordinates were found.',
      };
    }

    const result = await this.placeModel.bulkWrite(operations, {
      ordered: false,
    });

    return {
      fetched: elements.length,
      imported: operations.length,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
    };
  }

  private normalizeElement(element: OverpassElement): NormalizedPlace | null {
    const tags = element.tags ?? {};
    const lon = element.lon ?? element.center?.lon;
    const lat = element.lat ?? element.center?.lat;

    if (typeof lon !== 'number' || typeof lat !== 'number') {
      return null;
    }

    const category =
      tags.amenity ??
      tags.shop ??
      tags.tourism ??
      tags.leisure ??
      tags.healthcare ??
      'other';

    const wheelchair = this.normalizeWheelchair(tags.wheelchair);
    const toiletsWheelchair = this.normalizeToiletsWheelchair(
      tags['toilets:wheelchair'],
    );

    return {
      source: 'osm' as const,
      osmType: element.type,
      osmId: element.id,
      sourceId: `osm:${element.type}:${element.id}`,
      name: tags.name ?? '',
      category,
      location: {
        type: 'Point' as const,
        coordinates: [lon, lat] as [number, number],
      },
      tags,
      accessibility: {
        wheelchair,
        toiletsWheelchair,
      },
      updatedAt: new Date(),
    };
  }

  private normalizeWheelchair(
    value?: string,
  ): 'yes' | 'no' | 'limited' | 'unknown' {
    if (!value) {
      return 'unknown';
    }
    if (value === 'yes' || value === 'no' || value === 'limited') {
      return value;
    }
    return 'unknown';
  }

  private normalizeToiletsWheelchair(value?: string): 'yes' | 'no' | 'unknown' {
    if (!value) {
      return 'unknown';
    }
    if (value === 'yes' || value === 'no') {
      return value;
    }
    return 'unknown';
  }
}
