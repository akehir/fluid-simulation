import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ExampleComponent } from './example.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ExampleComponent,
      ],
      imports: [
        FluidSimulationModule.forRoot({}),
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular WebGL Fluid Simulation'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Angular WebGL Fluid Simulation');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Angular WebGL Fluid Simulation');
  });
});
