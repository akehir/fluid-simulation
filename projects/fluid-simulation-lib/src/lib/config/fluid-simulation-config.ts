import { InjectionToken } from '@angular/core';
import { Partial } from '../common';

export interface FluidSimulationConfig {
  SIM_RESOLUTION: number;
  DYE_RESOLUTION: number;
  CAPTURE_RESOLUTION: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  PRESSURE: number;
  PRESSURE_ITERATIONS: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  SHADING: boolean;
  COLORFUL: boolean;
  COLOR_UPDATE_SPEED: number;
  PAUSED: boolean;
  BACK_COLOR: {
    r: number;
    g: number;
    b: number;
  };
  TRANSPARENT: boolean;
  BLOOM: boolean;
  BLOOM_ITERATIONS: number;
  BLOOM_RESOLUTION: number;
  BLOOM_INTENSITY: number;
  BLOOM_THRESHOLD: number;
  BLOOM_SOFT_KNEE: number;
  DITHERING_TEXTURE: boolean;
  DITHERING_TEXTURE_URI: string;
  SUNRAYS: boolean;
  SUNRAYS_RESOLUTION: number;
  SUNRAYS_WEIGHT: number;
  ADD_SPLASHES_IN_RANDOM_INTERVALS: boolean;
  MOUSE_INTERACTION_LISTENERS: boolean;
  PAUSE_KEY_CODE: string;
  SPLASH_KEY: string;
  SCREENSHOT_KEY_CODE: string;
  SCREENSHOT_FILE_NAME: string;
}

export const FluidSimulationConfigValue = new InjectionToken<Partial<FluidSimulationConfig>>('FLUID_SIMULATION_CONFIG');
