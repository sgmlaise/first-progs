// city.model.ts
export interface City {
    id: number;
    name: string;
  }
  
  export interface CityDistances {
    cities: City[];
    distances: number[][];
  }
  