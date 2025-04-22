import { Component } from '@angular/core';
import { CityDataService } from '../../services/city-data.service';
import { TrafficModelService } from '../../services/traffic-model.service';
import { AiTripWeightServiceService } from '../../services/ai-trip.weight.service.service';
import { EdgeWeight } from '../../../assets/edge-weight.model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  conditionSets = [
    {
      label: 'Clear Morning – No Accidents',
      weather: 'clear',
      accidentSeverity: 0,
      timeOfDay: 'morning'
    },
    {
      label: 'Snowy Morning – Moderate Accidents',
      weather: 'snow',
      accidentSeverity: 3,
      timeOfDay: 'morning'
    },
    {
      label: 'Rainy Evening – Heavy Traffic',
      weather: 'rain',
      accidentSeverity: 2,
      timeOfDay: 'evening'
    },
    {
      label: 'Snow Night – Severe',
      weather: 'snow',
      accidentSeverity: 5,
      timeOfDay: 'night'
    },
    {
      label: 'Snow Night – Storm',
      weather: 'blizzard',
      accidentSeverity: 5,
      timeOfDay: 'night'
    }
  ];
  selectedConditionSetIndex = 0;
    grid: number[][] = [];
    weightedGrid: EdgeWeight[][] = [];
    rows: number = 8;
    cols: number = 8;
   
   shortestPath:any = [] ;
    cities: any[] = [];
    distances: number[][] = [];
    weightedDistances: EdgeWeight[][] = [];
    selectedStart = '0';
  startCityIndex = 0;
  endCityIndex = 5;
  getStartId(event:any) {
    this.startCityIndex = event.target.value;
 //   alert(selectedValue);
  }

  getEndId(event:any) {
    this.endCityIndex = event.target.value;
 //   alert(selectedValue);
  }
  adjustedDistances: number[][] = [];
  adjustedWeightedDistances: EdgeWeight[][] = [];
  weather = 'clear';
  accidentSeverity = 0;
  timeOfDay = 'morning';

  // Display
  segmentBreakdown: { from: string, to: string, distance: number }[] = [];
  finalDistance = 0 ;

  applyConditionSet(event:any): void {
    const selected = this.conditionSets[event.target.value];
  
    // Adjust distances using AI or logic
    this.adjustedWeightedDistances = this.aiWeightService.adjustWeightedDistances(
      this.adjustedWeightedDistances,
      selected.weather,
      selected.accidentSeverity,
      selected.timeOfDay,
      this.cities.map(c => c.name)
    );
    this.weightedGrid = this.adjustedWeightedDistances.map(row => [...row]); 
    // Recalculate shortest path
    //this.visualizeDijkstra(); // uses adjustedDistances
  }
    constructor(private aiWeightService: AiTripWeightServiceService, private cityDataService: CityDataService) {
       this.initializeWeightetGrid();
    }
    initializeWeightetGrid(idealConitions=true): void {
      this.cityDataService.getWeighterCityData().subscribe(data => {
        this.cities = data.cities;
        this.weightedDistances = data.distances;
        this.weightedGrid =  Array.from(this.weightedDistances,row => Array.from(row));
        this.adjustedWeightedDistances = this.aiWeightService.adjustWeightedDistances(
          this.weightedDistances,
          this.weather,
          this.accidentSeverity,
          this.timeOfDay,this.cities.map(c => c.name)
        );
  
        this.weightedGrid = this.adjustedWeightedDistances.map(row => [...row]); 
      
      });
      // create grid copy

   //   this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(1));
      

    }
    ngOnInit(): void {
      const weather = 'clear';
      const accidentSeverity = 3; // 1-5 scale
      const timeOfDay = 'morning';
      this.cityDataService.getCityData().subscribe(data => {
        this.cities = data.cities;
      });
    }
    visualizeDijkstra(): void {
       const numCities = this.cities.length;
      const distances = Array(numCities).fill(Infinity);
      const previousNodes = Array(numCities).fill(null);
      const unvisited = new Set<number>(Array.from({ length: numCities }, (_, i) => i));
    
      distances[this.startCityIndex] = 0;
    
      while (unvisited.size > 0) {
        // Find unvisited node with smallest distance
        let currentCityIndex = -1;
        let smallestDistance = Infinity;
    
        for (const cityIndex of unvisited) {
          if (distances[cityIndex] < smallestDistance) {
            smallestDistance = distances[cityIndex];
            currentCityIndex = cityIndex;
          }
        }
    
        if (currentCityIndex === -1) break;
        unvisited.delete(currentCityIndex);
    
        // Update distances for neighbors
        for (let neighborIndex = 0; neighborIndex < numCities; neighborIndex++) {
          if (!unvisited.has(neighborIndex)) continue;
    
          const edge: EdgeWeight = this.adjustedWeightedDistances[currentCityIndex][neighborIndex];
    
          if (!edge || edge.timeSpeedFactor === Infinity) continue;
    
          const newDistance = distances[currentCityIndex] + edge.timeSpeedFactor;
    
          if (newDistance < distances[neighborIndex]) {
            distances[neighborIndex] = newDistance;
            previousNodes[neighborIndex] = currentCityIndex;
          }
        }
      }
    
      // Reconstruct path from end to start
      const path: string[] = [];
      let currentIndex = this.endCityIndex;
    
      while (currentIndex !== null && currentIndex !== undefined) {
        path.unshift(this.cities[currentIndex].name);
        currentIndex = previousNodes[currentIndex];
      }
    
      this.shortestPath = path;
    
      console.log('Shortest Path:', path.join(' → '));
      this.finalDistance  = distances[this.endCityIndex]; 
      // Path segment distances
      this.segmentBreakdown  = path.length > 2 ? [{ from: path[0], to: path[path.length-1], distance:distances[this.endCityIndex] }]: [];
      for (let i = 0; i < path.length - 1; i++) {
        const fromName = path[i];
        const toName = path[i + 1];
      
        const fromIndex = this.cities.findIndex(c => c.name === fromName);
        const toIndex = this.cities.findIndex(c => c.name === toName);
        if (fromIndex !== -1 && toIndex !== -1) {
          const distance = this.adjustedWeightedDistances[fromIndex][toIndex]?.timeSpeedFactor ?? Infinity;

          this.segmentBreakdown.push({
            from: fromName,
            to: toName,
            distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
          });
        }
      }

       console.log(`Segment breakdown ${JSON.stringify(this.segmentBreakdown)}`);
      console.log(`Total Distance:, ${distances.join('->')} ${distances[this.endCityIndex]}`);
    }
   
   getSegmentBreakdown(path:string[]) {
    this.segmentBreakdown = [] ;
     /* 
    for (let i = 0; i < path.length - 1; i++) {
      const fromName = path[i];
      const toName = path[i + 1];
    
      const fromIndex = this.cities.findIndex(c => c.name === fromName);
      const toIndex = this.cities.findIndex(c => c.name === toName);
    
      if (fromIndex !== -1 && toIndex !== -1) {
        const distance = this.adjustedDistances[fromIndex][toIndex]?.timeSpeedFactor ?? Infinity;
    
        this.segmentBreakdown.push({
          from: fromName,
          to: toName,
          distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
        });
      }
   }
       */ 
  }
 

    
    get ShortestPath():string {
      return JSON.stringify(this.shortestPath)
    }
    isEdgeInShortestPath(from: number, to: number): boolean {
      const path = this.shortestPath;
      if (!path || path.length < 2) return false;
    
      for (let i = 0; i < path.length - 1; i++) {
        const a = path[i];
        const b = path[i + 1];
    
        const fromName = this.cities[from].name;
        const toName = this.cities[to].name;
    
        if (
          (fromName === a && toName === b) ||
          (fromName === b && toName === a)
        ) {
          return true;
        }
      }
    
      return false;
    }
  }
