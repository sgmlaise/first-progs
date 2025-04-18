import { Injectable } from '@angular/core';

import { EdgeWeight } from '../../assets/edge-weight.model';
import * as tf from '@tensorflow/tfjs';
@Injectable({
  providedIn: 'root'
})
export class AiTripWeightServiceService {
  private model: tf.LayersModel | null = null;

  constructor() { }
  cityNames:string[]  = [];
  private isRouteAffected(i: number, j: number): boolean {
    const affectedRoutes = [
      ['Reno', 'South Lake Tahoe'],
      ['Reno', 'Stateline'],
      ['Carson City', 'South Lake Tahoe']
    ];
    
    const cityA = this.cityNames[i];
    const cityB = this.cityNames[j];
  
    return affectedRoutes.some(([a, b]) =>
      (a === cityA && b === cityB) || (a === cityB && b === cityA)
    );
  }
  adjustDistances(distances: number[][], weather: string, accidentSeverity: number, timeOfDay: string,
    cityNames: string[]): number[][] {
      this.cityNames = cityNames;

    const weatherFactor = this.getWeatherMultiplier(weather);
    const timeFactor = this.getTimeMultiplier(timeOfDay);
    const accidentFactor = 1 + accidentSeverity * 0.05;
    return distances.map((row, i) =>
      row.map((distance, j) => {
        if (this.isRouteAffected(i, j)) {
          return +(distance * weatherFactor * timeFactor * accidentFactor).toFixed(2);
        }
        return distance;
      })
    );
    /* old return distances.map(row =>
      row.map(d => d * weatherFactor * accidentFactor * timeFactor)
    );
    */
  }

  adjustWeightedDistances(distances: EdgeWeight[][], weather: string, accidentSeverity: number, timeOfDay: string,
    cityNames: string[]): EdgeWeight[][] {
      this.cityNames = cityNames;

    const weatherFactor = this.getWeatherMultiplier(weather);
    const timeFactor = this.getTimeMultiplier(timeOfDay);
    const accidentFactor = 1 + accidentSeverity * 0.05;
    return distances.map((row, i) =>
      row.map((edge, j) => {
        const isAffected = this.isRouteAffected(i, j);
        const newTimeSpeedFactor = isAffected
        ? Math.round(edge.baseDistance * weatherFactor * timeFactor * accidentFactor * 100) / 100
        : edge.baseDistance;
        return {
          ...edge,
          timeSpeedFactor: newTimeSpeedFactor,
          weather: isAffected ? weather : undefined,
          timeOfDay: isAffected ? timeOfDay : undefined,
          accidentFactor: isAffected ? accidentSeverity : undefined,
          affected: isAffected
        };
      })
    );
    /* old return distances.map(row =>
      row.map(d => d * weatherFactor * accidentFactor * timeFactor)
    );
    */
  }
  private getWeatherMultiplier(weather: string): number {
    switch (weather.toLowerCase()) {
      case 'snow': return 1.5;
      case 'rain': return 1.2;
      case 'clear': return 1.0;
      default: return 1.0;
    }
  }

  private getTimeMultiplier(timeOfDay: string): number {
    switch (timeOfDay.toLowerCase()) {
      case 'morning': return 1.1;
      case 'evening': return 1.2;
      case 'night': return 0.9;
      default: return 1.0;
    }
  }
/* Older version to end of file */
  // Load a pre-trained model or build one
  async loadModel() {
    this.model = await tf.loadLayersModel('assets/model.json'); // Assuming you have a pre-trained model
    console.log('Model loaded');
  }
  // Simulate prediction (for now, mock data)
  predictWeights(weather: string, accidentSeverity: number, timeOfDay: string): number {
    // Map input features to a tensor
    const inputTensor = tf.tensor2d([[this.weatherToValue(weather), accidentSeverity, this.timeOfDayToValue(timeOfDay)]]);
    const prediction = this.model!.predict(inputTensor) as tf.Tensor;
    const predictedWeight = prediction.dataSync()[0]; // Get predicted weight

    return predictedWeight;
  }

  private weatherToValue(weather: string): number {
    // Example mapping
    return weather === 'snow' ? 1.5 : weather === 'rain' ? 1.2 : 1;
  }

  private timeOfDayToValue(timeOfDay: string): number {
    // Example mapping: morning=0.5, evening=1.0, etc.
    return timeOfDay === 'morning' ? 0.5 : 1.0;
  }

}
