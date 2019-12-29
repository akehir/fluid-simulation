export const ngModule = `import { FluidSimulationModule } from '@triangular/fluid-simulation';

@NgModule({
    declarations: [
      AppComponent,
      ...,
    ],
    imports: [
      ...,
      FluidSimulationModule.forRoot(),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
`;

export const component = `<webgl-fluid-simulation></webgl-fluid-simulation>`;

export const moduleWithConfiguration = `@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
  ],
    imports: [
      BrowserModule,
      FluidSimulationModule.forRoot({
        SCREENSHOT_KEY_CODE: 'KeyS',
        PAUSE_KEY_CODE: 'KeyP',
        SPLASH_KEY: 'w',
        DITHERING_TEXTURE: true,
        DITHERING_TEXTURE_URI: 'assets/LDR_LLL1_0.png',
      }),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }`;

export const styles = `
webgl-fluid-simulation {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
}

webgl-fluid-simulation canvas {
  width: 100%;
  height: 100%;
  /* the canvas position cannot be absolute, otherwise the js resize will bug out */
  position: fixed;
}
`;

export const service = `import { Component } from '@angular/core';
import { FluidSimulationService } from '@triangular/fluid-simulation';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css'],
})
export class ExampleComponent {

  constructor(private fluidSimulation: FluidSimulationService) { }

    onClick() {
      // Toggle the simulation
      this.fluidSimulation.PAUSED = !this.fluidSimulation.PAUSED;
    }
}`;
