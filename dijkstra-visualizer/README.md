# DijkstraVisualizer

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

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
### DEVELOPER NOTES - Shantanu Gadkari
##### Tensorflowjs compatiblity issues - added line 
    "skipLibCheck": true in compilerOptions of tsconfig.json
    - for tensorflow and budget issues
Warning: /Users/shantanu/Documents/GitHub/first-progs/dijkstra-visualizer/node_modules/@tensorflow/tfjs-core/dist/hash_util.js depends on 'long'. CommonJS or AMD dependencies can cause optimization bailouts.
angular.json
    "architect": {
  "build": {
    "options": {
      "allowedCommonJsDependencies": [
        "long", "@tensorflow/tfjs-core"
      ]
    }
  }
}
- bundle initial exceeded maximum budget. Budget 1.00 MB was not met by 152.66 kB 
angular.json
"configurations": {
  "production": {
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "1.5mb",
        "maximumError": "2mb"
      }
    ]
  }
}