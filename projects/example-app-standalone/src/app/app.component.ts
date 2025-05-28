import { Component } from '@angular/core';

import {FluidSimulationComponent, FluidSimulationService} from "@triangular/fluid-simulation";

@Component({
    selector: 'app-root',
    imports: [FluidSimulationComponent],
    providers: [FluidSimulationService],
    templateUrl: './app.component.html',
    styleUrls: []
})
export class AppComponent {
  title = 'example-app-standalone';
}
