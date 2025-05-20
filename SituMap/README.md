# SituMap

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.# SituMap: Initial Setup and Development Guide

## 🧭 Project Overview

SituMap is an Angular-based GPS application that incorporates predictive intelligence for navigation, including factors like traffic, weather, and political climate.

---

## ✅ Step 1: Project Initialization

### 1.1 Install Angular CLI

```bash
npm install -g @angular/cli
```

### 1.2 Create a New Angular Project

```bash
ng new situ-map
cd situ-map
```

### 1.3 Add Google Maps JavaScript API

* Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
* Create a new project or use an existing one
* Enable the **Maps JavaScript API**
* Generate an API Key

### 1.4 Add Google Maps to `index.html`

```html
<!-- index.html -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

---

## ✅ Step 2: Map Component Setup

### 2.1 Generate a Map Component

```bash
ng generate component map-view
```

### 2.2 Add Basic Google Map in `map-view.component.ts`

```ts
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap!: ElementRef;
  map!: google.maps.Map;

  coordinates = new google.maps.LatLng(39.5296, -119.8138); // Reno, NV

  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 9,
  };

  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: this.map,
      center: this.coordinates,
      radius: 160934 // 100 miles in meters
    });
  }
}
```

### 2.3 HTML for Map View

```html
<!-- map-view.component.html -->
<div #mapContainer id="map" style="height: 500px; width: 100%;"></div>
```

### 2.4 Use Component in `app.component.html`

```html
<app-map-view></app-map-view>
```

---

## ✅ Step 3: TensorFlow\.js Integration

### 3.1 Install TensorFlow\.js

```bash
npm install @tensorflow/tfjs
```

### 3.2 Sample TensorFlow Usage

```ts
import * as tf from '@tensorflow/tfjs';

const input = tf.tensor2d([
  [0, 1],
  [1, 0]
]);

input.print();
```

---

## 🧠 Future Enhancements

* Integrate predictive models for traffic, weather, and political events
* Build a distance matrix/tree graph of nearby cities within 100 miles
* Store and visualize prediction data over time

---

## ✅ Naming

**App Name:** SituMap (Situation + Map)

---

Let me know if you'd like a logo, tagline, or further modularization of components!

