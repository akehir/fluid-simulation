# Angular WebGL Fluid Simulation Component

If you want to use a fancy WebGL fluid simulation in your Angular App, this small demo can get you started. 

You can see the component running in the background of the example app. Press `p` to toggle the pause, and press `s` to download a screenshot of the simulation. Press `w` to create more splashes.

## Demo
You can find the live demo at: https://fluid-simulation.akehir.com.

## Getting Started

If you just want to use the library, follow the following 3 simple steps. For contributing, or building the library locally, see the section on [building](#building) the library.

Supported Angular Versions
| Angular Version | WebGL Fluid Simulation V |
| --------------- | ------------------------ |
|  7.x, 8.x       | 1.0.1                    |
|  9.x            | ^2.0.0                   |
| 10.x            | ^3.0.0                   |
| 11.x            | ^4.0.0                   |
| 12.x            | ^5.0.0                   |

### Step 1: Install

Install the npm package.

```
npm i @triangular/fluid-simulation
```

### Step 2: Add to NgModule Imports

Then, add the __FluidSimulationModule__ to the imports of your app.

```typescript
import { FluidSimulationModule } from '@triangular/fluid-simulation';

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
```

### Step 3: Add Component to App
Now you can use the provided component __<webgl-fluid-simulation></webgl-fluid-simulation>__ to create a canvas element with the simulation.
```html
<webgl-fluid-simulation></webgl-fluid-simulation>
```

Depending on whether you want to use certain features, or positions for the module, you can add styles as follows. It is important to note, that the canvas itself should not be absolutely positioned.

```css
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

```

You can configure your module by using the `FluidSimulationModule.forRoot()` method.

```typescript
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
```

In order to change the config interactively (for instance pausing and playing the simulation, or changing the settings) , you can use the provided service.

The service will be extended to include more functionality (for example triggering screenshots or adding splashes).

```typescript
import { Component } from '@angular/core';
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
}
```

## Building
As a pre-requisite to build the library, you need to install all the dependencies via `npm install` or `yarn`.

### Building the Library
Before the sample app can be run, you need to build the library itself.

```
npm run ng -- build fluid-simulation-lib --progress=false
```

### Building the Sample App
After building the library, it is either possible to build the sample app, via

```
npm run ng -- build example-app --prod --progress=false
```

,or to run the sample app with a local dev server:

```
npm run ng -- serve
```

## Running the tests

### Unit Tests
There are not many tests, but those that are can be run with:

```
npm run test -- --no-watch --progress=false --code-coverage --browsers ChromeHeadless
```

### And coding style tests

The project follows the [angular style guide](https://angular.io/guide/styleguide) and lints with the following command:

```
npm run lint
```

## Built With

* [WebGL](https://www.khronos.org/webgl/) - 3D Graphics for the Web
* [Angular](https://github.com/angular/angular) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Gitlab](https://git.akehir.com) - Source Control & CI Runner

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. 

### Version History

- 1.0.0: Initial Release
- 1.0.1: Update Readme

## Authors

* **Raphael Ochsenbein** - *Angular Part* - [Akehir](https://github.com/akehir)
* **Pavel Dobryakovn** - *JavaScript WebGL Fluid Simulation* - [PavelDoGreat](https://github.com/PavelDoGreat)

See also the list of [contributors](https://github.com/akehir/fluid-simulation/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Pavel Dobryakov](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) for creating the original JavaScript WebGL Fluid Simulation
* [angularindepth](https://blog.angularindepth.com/creating-a-library-in-angular-6-87799552e7e5) for a tutorial for creating an angular library
* [PurpleBooth](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2/) for the readme template

