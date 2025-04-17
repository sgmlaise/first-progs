import { Injectable } from '@angular/core';

import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class TrafficModelService {

  
  private model: tf.LayersModel | null = null;

  constructor() { }

  async loadModel(): Promise<void> {
    this.model = await tf.loadLayersModel('assets/models/traffic-model.json');
  }

  async predict(input: number[]): Promise<number[]> {
    if (!this.model) {
      throw new Error('Model is not loaded');
    }
    const inputTensor = tf.tensor2d([input]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    return prediction.arraySync() as number[];
  }
}
