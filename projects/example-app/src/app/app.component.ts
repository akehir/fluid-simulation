import {Component} from '@angular/core';
import {ngModule, component, styles, service, moduleWithConfiguration} from './code';

// eslint-disable-next-line @angular-eslint/prefer-standalone
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [],
  standalone: false
})
export class AppComponent {
  title = 'Angular WebGL Fluid Simulation';
  step2 = ngModule;
  step3a = component;
  step3b = styles;
  step3c = moduleWithConfiguration;
  step3d = service;
}
