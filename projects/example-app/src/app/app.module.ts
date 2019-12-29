import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ExampleComponent } from './example.component';
import { FluidSimulationModule } from '@triangular/fluid-simulation';

@NgModule({
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
export class AppModule { }
