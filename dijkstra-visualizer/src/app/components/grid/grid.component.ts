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
  weather = 'snow';
  accidentSeverity = 3;
  timeOfDay = 'morning';
    constructor(private aiWeightService: AiTripWeightServiceService, private cityDataService: CityDataService) {
      this.initializeGrid();
      this.initializeWeightetGrid();
    }
    initializeGrid(): void {
      this.cityDataService.getCityData().subscribe(data => {
        this.cities = data.cities;
        this.distances = data.distances;
        this.grid =  Array.from(this.distances,row => Array.from(row));
        this.adjustedDistances = this.aiWeightService.adjustDistances(
          this.distances,
          this.weather,
          this.accidentSeverity,
          this.timeOfDay,this.cities.map(c => c.name)
        );
  
        this.grid = this.adjustedDistances.map(row => [...row]); 
      });
      // create grid copy

   //   this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(1));
      

    }
    initializeWeightetGrid(): void {
      this.cityDataService.getWeighterCityData().subscribe(data => {
        this.cities = data.cities;
        this.weightedDistances = data.distances;
        this.weightedGrid =  Array.from(this.weightedDistances,row => Array.from(row));
         /* later this.adjustedDistances = this.aiWeightService.adjustDistances(
          this.distances,
          this.weather,
          this.accidentSeverity,
          this.timeOfDay,this.cities.map(c => c.name)
        );
  
        this.weightedGrid = this.adjustedDistances.map(row => [...row]); 
        */
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
        this.distances = data.distances;
      });
      this.initializeGrid();
    }
    visualizeDijkstra(): void {
      // Implement Dijkstra's algorithm here using this.cities and this.distances
    // Index of the destination city
    const weather = 'clear';
    const accidentSeverity = 1;
    const timeOfDay = 'AFTERN';
  
  //  const adjustedDistances = this.aiWeightService.adjustDistances(this.distances, weather, accidentSeverity, timeOfDay,this.cities.map(c => c.name));
 // alert(JSON.stringify(adjustedDistances));
  // Initialize distances and previous nodes
  const distances = Array(this.cities.length).fill(Infinity);
  const previousNodes = Array(this.cities.length).fill(null);
  const unvisitedCities = new Set(this.cities.map((_, index) => index));
  distances[this.startCityIndex] = 0;

  while (unvisitedCities.size > 0) {
    // Find the unvisited city with the smallest distance
    let currentCityIndex = -1;
    let smallestDistance = Infinity;
    console.log('smallest distance: unvisited cities');
    unvisitedCities.forEach((cityIndex) => {
      if (distances[cityIndex] < smallestDistance) {
        smallestDistance = distances[cityIndex];
        currentCityIndex = cityIndex;
        console.log(`smallest distance: ${smallestDistance}, city ${this.cities[cityIndex].name}`);
   
      }
    });

    // If the smallest distance is infinity, there's no path
    if (smallestDistance === Infinity) {
      break;
    }

    // Remove the current city from the unvisited set
    unvisitedCities.delete(currentCityIndex);

    // Update distances for neighboring cities
    this.cities.forEach((_, neighborIndex) => {
      if (neighborIndex !== currentCityIndex && unvisitedCities.has(neighborIndex)) {
        const newDistance = distances[currentCityIndex] ;

        if (newDistance < distances[neighborIndex]) {
          distances[neighborIndex] = newDistance;
          previousNodes[neighborIndex] = currentCityIndex;
        }
      }
    });
  }

  // Reconstruct the shortest path
  const path = [];
  let currentCityIndex = this.endCityIndex;

  while (currentCityIndex !== null) {
    path.unshift(this.cities[currentCityIndex].name);
    currentCityIndex = previousNodes[currentCityIndex];
  }
  this.shortestPath = [...path];
  // Display the shortest path and its distance
  console.log('Shortest path:', path.join(' -> '));
  console.log('Total distance:', distances[this.endCityIndex]);
    }
    visualizeDijkstraOld(): void {
      // Implement Dijkstra's algorithm here
      // Update the grid to reflect the shortest path
      const start = [0, 0];
      const end = [this.rows - 1, this.cols - 1];
      const visited = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
      const distance = Array.from({ length: this.rows }, () => Array(this.cols).fill(Infinity));
      const previous = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
    
      distance[start[0]][start[1]] = 0;
    
      const unvisited = [[...start]];while (unvisited.length > 0) {
        // Find the node with the smallest distance
        const [currentRow, currentCol] = unvisited.pop()!;
        if (visited[currentRow][currentCol]) continue;
    
        visited[currentRow][currentCol] = true;
    
        // Check neighbors
        const neighbors = [
          [currentRow - 1, currentCol],
          [currentRow + 1, currentCol],
          [currentRow, currentCol - 1],
          [currentRow, currentCol + 1]
        ];
    
        for (const [neighborRow, neighborCol] of neighbors) {
          if (
            neighborRow >= 0 && neighborRow < this.rows &&
            neighborCol >= 0 && neighborCol < this.cols &&
            !visited[neighborRow][neighborCol]
          ) {
            const alt = distance[currentRow][currentCol] + 1;
            if (alt < distance[neighborRow][neighborCol]) {
              distance[neighborRow][neighborCol] = alt;
              previous[neighborRow][neighborCol] = [currentRow, currentCol];
              unvisited.push([neighborRow, neighborCol]);
            }
          }
        }
        }// Reconstruct the shortest path
      let path = [];
      let current = end;
      while (current) {
        path.unshift(current);
        current = previous[current[0]][current[1]];
      }

      // Update the grid to reflect the path
      for (const [row, col] of path) {
        this.grid[row][col] = 2;
      }
    }
    get ShortestPath():string {
      return JSON.stringify(this.shortestPath)
    }
  }
