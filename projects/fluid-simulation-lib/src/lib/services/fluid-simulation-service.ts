import { Inject, Injectable, Optional } from '@angular/core';
import { FluidSimulationConfig, FluidSimulationConfigValue } from '../config';
import { defaultConfig } from '../config';
import { Partial } from '../common';

@Injectable()
export class FluidSimulationService implements FluidSimulationConfig {
  BACK_COLOR: { r: number; g: number; b: number };
  BLOOM: boolean;
  BLOOM_INTENSITY: number;
  BLOOM_ITERATIONS: number;
  BLOOM_RESOLUTION: number;
  BLOOM_SOFT_KNEE: number;
  BLOOM_THRESHOLD: number;
  CAPTURE_RESOLUTION: number;
  COLORFUL: boolean;
  COLOR_UPDATE_SPEED: number;
  CURL: number;
  DENSITY_DISSIPATION: number;
  DYE_RESOLUTION: number;
  PAUSED: boolean;
  PRESSURE: number;
  PRESSURE_ITERATIONS: number;
  SHADING: boolean;
  SIM_RESOLUTION: number;
  SPLAT_FORCE: number;
  SPLAT_RADIUS: number;
  SUNRAYS: boolean;
  SUNRAYS_RESOLUTION: number;
  SUNRAYS_WEIGHT: number;
  TRANSPARENT: boolean;
  VELOCITY_DISSIPATION: number;
  ADD_SPLASHES_IN_RANDOM_INTERVALS: boolean;
  MOUSE_INTERACTION_LISTENERS: boolean;
  PAUSE_KEY_CODE: string;
  SPLASH_KEY: string;
  SCREENSHOT_KEY_CODE: string;
  SCREENSHOT_FILE_NAME: string;
  DITHERING_TEXTURE: boolean;
  DITHERING_TEXTURE_URI: string;

  constructor(@Optional() @Inject(FluidSimulationConfigValue) config: Partial<FluidSimulationConfig>) {
    Object.assign(this, defaultConfig);

    if (config) {
      Object.assign(this, config);
    }
  }
}
