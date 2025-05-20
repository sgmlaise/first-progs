// sample-data.ts
import { CityDistances } from './ai-poc-basic-city-distances.model';

export const CITY_DISTANCES_DATA: CityDistances = {
  cities: [
    { id: 0, name: "Reno" },
    { id: 1, name: "Sparks" },
    { id: 2, name: "Carson City" },
    { id: 3, name: "Incline Village" },
    { id: 4, name: "Truckee" },
    { id: 5, name: "South Lake Tahoe" },
    { id: 6, name: "Kings Beach" },
    { id: 7, name: "Stateline" }
  ],
  distances: [
    [0, 5, 30, 28, 33, 60, 36, 58],
    [5, 0, 28, 26, 31, 58, 34, 56],
    [30, 28, 0, 20, 43, 25, 22, 14],
    [28, 26, 20, 0, 26, 34, 15, 30],
    [33, 31, 43, 26, 0, 45, 28, 50],
    [60, 58, 25, 34, 45, 0, 22, 3],
    [36, 34, 22, 15, 28, 22, 0, 20],
    [58, 56, 14, 30, 50, 3, 20, 0]
  ]
};