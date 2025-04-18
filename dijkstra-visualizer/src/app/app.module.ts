import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GridComponent } from './components/grid/grid.component';
import { TrafficModelService } from './services/traffic-model.service';
import { CityDataService } from './services/city-data.service' ;
import { AiTripWeightServiceService } from './services/ai-trip.weight.service.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent,TrafficModelService, AiTripWeightServiceService, CityDataService]
})
export class AppModule { }
