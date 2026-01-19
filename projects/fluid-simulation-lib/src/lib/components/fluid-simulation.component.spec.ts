import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidSimulationComponent } from './fluid-simulation.component';

import { FluidSimulationConfigValue } from '../config/fluid-simulation-config';
import { defaultConfig } from '../config/default-config';
import { FluidSimulationService } from '../services/fluid-simulation-service';
import { provideZonelessChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

describe('FluidSimulationComponent', () => {
  let component: FluidSimulationComponent;
  let fixture: ComponentFixture<FluidSimulationComponent>;

  beforeEach(() =>
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [
        FluidSimulationComponent
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        {
          provide: FluidSimulationConfigValue,
          useValue: defaultConfig,
        },
        FluidSimulationService,
      ],
    })
    .compileComponents()
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
