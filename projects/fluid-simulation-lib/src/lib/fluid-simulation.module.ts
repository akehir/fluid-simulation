import { ModuleWithProviders, NgModule } from '@angular/core';
import { FluidSimulationComponent } from './components/fluid-simulation.component';
import { FluidSimulationService } from './services/fluid-simulation-service';
import { FluidSimulationConfigValue, FluidSimulationConfig } from './config/fluid-simulation-config';
import { Partial } from './common';

@NgModule({
  declarations: [FluidSimulationComponent],
  exports: [FluidSimulationComponent]
})
export class FluidSimulationModule {
  static forRoot(config: Partial<FluidSimulationConfig> = {}): ModuleWithProviders<FluidSimulationModule> {
    return {
      ngModule: FluidSimulationModule,
      providers: [
        {
          provide: FluidSimulationConfigValue,
          useValue: config,
        },
        FluidSimulationService,
      ]
    };
  }
}
