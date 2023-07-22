import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidSimulationComponent } from './fluid-simulation.component';

import { RouterTestingModule } from '@angular/router/testing';
import { FluidSimulationConfigValue } from '../config/fluid-simulation-config';
import { defaultConfig } from '../config/default-config';
import { FluidSimulationService } from '../services/fluid-simulation-service';

describe('FluidSimulationComponent', () => {
  let component: FluidSimulationComponent;
  let fixture: ComponentFixture<FluidSimulationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [  ],
      imports: [
        RouterTestingModule,
        FluidSimulationComponent
      ],
      providers: [
        {
          provide: FluidSimulationConfigValue,
          useValue: defaultConfig,
        },
        FluidSimulationService,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
