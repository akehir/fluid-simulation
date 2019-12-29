import { ModuleWithProviders, NgModule } from '@angular/core';
import { FluidSimulationComponent } from './components';
import { FluidSimulationService } from './services';
import { FluidSimulationConfigValue, FluidSimulationConfig } from './config';
import { Partial } from './common';

@NgModule({
  declarations: [FluidSimulationComponent],
  exports: [FluidSimulationComponent]
})
export class FluidSimulationModule {
  static forRoot(config: Partial<FluidSimulationConfig> = {}): ModuleWithProviders {
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
