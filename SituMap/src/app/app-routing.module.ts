import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapViewComponent } from './components/map-view/map-view.component';

const routes: Routes = [
  { path: '', component: MapViewComponent }, // 👈 Default route
  { path: '**', redirectTo: '' } // Optional: redirect unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
