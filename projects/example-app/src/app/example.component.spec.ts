import { TestBed, async } from '@angular/core/testing';
import { ExampleComponent } from './example.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';

describe('ExampleComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExampleComponent
      ],
      imports: [
        FluidSimulationModule.forRoot({}),
      ],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(ExampleComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
