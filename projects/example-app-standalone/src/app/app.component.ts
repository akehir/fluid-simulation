import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FluidSimulationComponent, FluidSimulationService} from "@triangular/fluid-simulation";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FluidSimulationComponent],
  providers: [FluidSimulationService],
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'example-app-standalone';
}
