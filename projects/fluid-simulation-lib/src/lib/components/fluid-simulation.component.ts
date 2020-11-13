import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  NgZone, Inject, OnDestroy,
} from '@angular/core';

import { FluidSimulationService } from '../services/fluid-simulation-service';

import {
  Context,
  Material,
  Program,
  getWebGLContext,
  PointerPrototype,
  advectionShader,
  baseVertexShader,
  bloomBlurShader,
  bloomFinalShader,
  bloomPrefilterShader,
  blurShader,
  blurVertexShader,
  checkerboardShader,
  clearShader,
  colorShader,
  copyShader,
  curlShader,
  divergenceShader,
  gradientSubtractShader,
  pressureShader,
  splatShader,
  sunraysMaskShader,
  sunraysShader,
  vorticityShader,
  createFBO,
  createDoubleFBO,
  resizeDoubleFBO,
  createTextureAsync,
  blit,
  correctRadius,
  getResolution,
  framebufferToTexture,
  normalizeTexture,
  textureToCanvas,
  downloadURI,
  generateColor,
  getTextureScale,
  normalizeColor,
  wrap,
  scaleByPixelRatio,
  updatePointerUpData,
  updatePointerMoveData,
  updatePointerDownData,
  isMobile,
} from '../common';
import { combineLatest, concat, defer, fromEvent, Observable, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  // tslint:disable
  selector: 'webgl-fluid-simulation',
  // tslint:enable
  templateUrl: './fluid-simulation.component.html',
  styleUrls: [],
  // styleUrls: ['./fluid-simulation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class FluidSimulationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas', {static: true}) canvasRef: ElementRef;

  private canvas: HTMLCanvasElement;

  // WebGL Fluid Animation
  private pointers = [];
  private splatStack = [];

  private lastUpdateTime = Date.now();
  private colorUpdateTimer = 0.0;

  // Component State
  private destroyed = false;
  private hidden = true;
  private MOUSE_INTERACTION_LISTENERS: boolean;
  private KEYS_INTERACTION_LISTENERS: boolean;
  private pageVisible$: Observable<boolean>;
  private canvasVisible$: Observable<boolean>;
  private activeStateChange$: Observable<boolean>;


  // context
  private gl: Context | null;
  private ext;

  // blit
  private blit;

  private dye;
  private velocity;
  private divergence;
  private curl;
  private pressure;
  private bloom;
  private bloomFramebuffers = [];
  private sunrays;
  private sunraysTemp;

  private ditheringTexture;

  private blurProgram: Program;
  private copyProgram: Program;
  private clearProgram: Program;
  private colorProgram: Program;
  private checkerboardProgram: Program;
  private bloomPrefilterProgram: Program;
  private bloomBlurProgram: Program;
  private bloomFinalProgram: Program;
  private sunraysMaskProgram: Program;
  private sunraysProgram: Program;
  private splatProgram: Program;
  private advectionProgram: Program;
  private divergenceProgram: Program;
  private curlProgram: Program;
  private vorticityProgram: Program;
  private pressureProgram: Program;
  private gradientSubtractProgram: Program;

  private displayMaterial: Material;

  constructor(
    @Inject(DOCUMENT) document: any,
    private zone: NgZone,
    private config: FluidSimulationService,
    ) {
    // As per: https://medium.com/angular-in-depth/improve-performance-with-lazy-components-f3c5ff4597d2
    this.pageVisible$ = concat(
      defer(() => of(!document.hidden)),
      fromEvent(document, 'visibilitychange')
        .pipe(
          map(e => !document.hidden)
        )
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroyed = true;

    if (this.MOUSE_INTERACTION_LISTENERS) {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    }

    if (this.KEYS_INTERACTION_LISTENERS) {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  ngAfterViewInit() {
    // WebGL Fluid Animation
    this.canvas = this.canvasRef.nativeElement;

    if (!(this.canvas instanceof HTMLCanvasElement)) {
      // in case the canvas is not what's expected, we have a problem
      throw new Error('Canvas element is not correctly provided. Cannot initialize webgl fluid simulation.');
    }

    // As per: https://medium.com/angular-in-depth/improve-performance-with-lazy-components-f3c5ff4597d2
    this.canvasVisible$ = new Observable(observer => {
      const intersectionObserver = new IntersectionObserver(entries => {
        observer.next(entries);
      });

      intersectionObserver.observe(this.canvas);

      return () => { intersectionObserver.disconnect(); };

    })
      .pipe (
        map(entries => entries[0] || {isIntersecting: false}),
        map(entry => entry.isIntersecting),
        distinctUntilChanged(),
      );

    // As per: https://medium.com/angular-in-depth/improve-performance-with-lazy-components-f3c5ff4597d2
    this.activeStateChange$ = combineLatest([
      this.pageVisible$,
      this.canvasVisible$,
    ])
      .pipe (
        map(([pageVisible, elementVisible]) => pageVisible && elementVisible),
        distinctUntilChanged()
      );

    this.resizeCanvas(this.canvas);
    const ctx = getWebGLContext(this.canvas);
    this.gl = ctx.gl;
    this.ext = ctx.ext;

    if (isMobile()) {
      this.config.DYE_RESOLUTION = 256;
    }

    if (!ctx.ext.supportLinearFiltering) {
      this.config.DYE_RESOLUTION = 256;
      this.config.SHADING = false;
      this.config.BLOOM = false;
      this.config.SUNRAYS = false;
    }

    this.blit = blit(ctx.gl);

    this.pointers.push(new PointerPrototype());
    if (this.config.DITHERING_TEXTURE && !!this.config.DITHERING_TEXTURE_URI) {
      this.ditheringTexture = createTextureAsync(ctx.gl, this.config.DITHERING_TEXTURE_URI);
    }

    this.blurProgram            = new Program(ctx.gl, blurVertexShader, blurShader);
    this.copyProgram            = new Program(ctx.gl, baseVertexShader, copyShader);
    this.clearProgram           = new Program(ctx.gl, baseVertexShader, clearShader);
    this.colorProgram           = new Program(ctx.gl, baseVertexShader, colorShader);
    this.checkerboardProgram    = new Program(ctx.gl, baseVertexShader, checkerboardShader);
    this.bloomPrefilterProgram  = new Program(ctx.gl, baseVertexShader, bloomPrefilterShader);
    this.bloomBlurProgram       = new Program(ctx.gl, baseVertexShader, bloomBlurShader);
    this.bloomFinalProgram      = new Program(ctx.gl, baseVertexShader, bloomFinalShader);
    this.sunraysMaskProgram     = new Program(ctx.gl, baseVertexShader, sunraysMaskShader);
    this.sunraysProgram         = new Program(ctx.gl, baseVertexShader, sunraysShader);
    this.splatProgram           = new Program(ctx.gl, baseVertexShader, splatShader);
    this.advectionProgram       = new Program(ctx.gl, baseVertexShader, advectionShader, this.ext);
    this.divergenceProgram      = new Program(ctx.gl, baseVertexShader, divergenceShader);
    this.curlProgram            = new Program(ctx.gl, baseVertexShader, curlShader);
    this.vorticityProgram       = new Program(ctx.gl, baseVertexShader, vorticityShader);
    this.pressureProgram        = new Program(ctx.gl, baseVertexShader, pressureShader);
    this.gradientSubtractProgram = new Program(ctx.gl, baseVertexShader, gradientSubtractShader);

    this.displayMaterial = new Material(ctx.gl, baseVertexShader);

    // todo: draw or do things by drawing.
    this.zone.runOutsideAngular(() => {
      this.updateKeywords();
      this.initFramebuffers();
      this.multipleSplats(Math.floor(Math.random() * 20) + 5);

      this.lastUpdateTime = Date.now();
      this.colorUpdateTimer = 0.0;

      // Only if element is visible, and tab is open, we execute the rendering.
      // We also only start the rendering, if the component was previously hidden.
      this.activeStateChange$.subscribe((visible) => {
        if (visible && this.hidden) {
          this.hidden = !visible; // need to change the state, otherwise update will immediately return
          this.update(); // Update will call itself until visibility changes or component is destroyed
        }

        this.hidden = !visible;
      });

      if (this.config.MOUSE_INTERACTION_LISTENERS) {
        this.MOUSE_INTERACTION_LISTENERS = true; // listeners were added
        this.canvas.addEventListener('mousedown', this.handleMouseDown);

        this.canvas.addEventListener('mousemove', e => {
          const pointer = this.pointers[0];
          if (!pointer.down) { return; }
          const posX = scaleByPixelRatio(e.offsetX);
          const posY = scaleByPixelRatio(e.offsetY);
          updatePointerMoveData(this.canvas, pointer, posX, posY);
        });

        window.addEventListener('mouseup', () => {
          updatePointerUpData(this.pointers[0]);
        });

        this.canvas.addEventListener('touchstart', e => {
          e.preventDefault();
          const touches = e.targetTouches;
          while (touches.length >= this.pointers.length) {
            this.pointers.push(new PointerPrototype());
          }
          for (let i = 0; i < touches.length; i++) {
            const posX = scaleByPixelRatio(touches[i].pageX);
            const posY = scaleByPixelRatio(touches[i].pageY);
            updatePointerDownData(this.canvas, this.pointers[i + 1], touches[i].identifier, posX, posY);
          }
        });

        this.canvas.addEventListener('touchmove', e => {
          e.preventDefault();
          const touches = e.targetTouches;
          for (let i = 0; i < touches.length; i++) {
            const pointer = this.pointers[i + 1];
            if (!pointer.down) { continue; }
            const posX = scaleByPixelRatio(touches[i].pageX);
            const posY = scaleByPixelRatio(touches[i].pageY);
            updatePointerMoveData(this.canvas, pointer, posX, posY);
          }
        }, false);

        window.addEventListener('touchend', e => {
          const touches = e.changedTouches;
          for (let i = 0; i < touches.length; i++) { // tslint:disable-line
            const pointer = this.pointers.find(p => p.id === touches[i].identifier);
            if (pointer === null) { continue; }
            updatePointerUpData(pointer);
          }
        });
      }

      if (
        !!this.config.PAUSE_KEY_CODE ||
        !!this.config.SPLASH_KEY ||
        !!this.config.SCREENSHOT_KEY_CODE
      ) {
        this.KEYS_INTERACTION_LISTENERS = true;
        window.addEventListener('keydown', this.handleKeyDown);
      }

      this.addRandomPoints();
    });
  }

  initFramebuffers() {
    const simRes = getResolution(this.gl, this.config.SIM_RESOLUTION);
    const dyeRes = getResolution(this.gl, this.config.DYE_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const rgba    = this.ext.formatRGBA;
    const rg      = this.ext.formatRG;
    const r       = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

    if (this.dye == null) {
      this.dye = createDoubleFBO(this.gl, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    } else {
      this.dye = resizeDoubleFBO(this.gl, this.blit, this.copyProgram, this.dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    }

    if (this.velocity == null) {
      this.velocity = createDoubleFBO(this.gl, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    } else {
      this.velocity = resizeDoubleFBO(this.gl, this.blit, this.copyProgram, this.velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    }

    this.divergence = createFBO      (this.gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST);
    this.curl       = createFBO      (this.gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST);
    this.pressure   = createDoubleFBO(this.gl, simRes.width, simRes.height, r.internalFormat, r.format, texType, this.gl.NEAREST);

    this.initBloomFramebuffers();
    this.initSunraysFramebuffers();
  }

  initBloomFramebuffers() {
    const res = getResolution(this.gl, this.config.BLOOM_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

    this.bloom = createFBO(this.gl, res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering);

    this.bloomFramebuffers.length = 0;
    for (let i = 0; i < this.config.BLOOM_ITERATIONS; i++) {
      const width = res.width >> (i + 1); // tslint:disable-line:no-bitwise
      const height = res.height >> (i + 1); // tslint:disable-line:no-bitwise

      if (width < 2 || height < 2) { break; }

      const fbo = createFBO(this.gl, width, height, rgba.internalFormat, rgba.format, texType, filtering);
      this.bloomFramebuffers.push(fbo);
    }
  }

  initSunraysFramebuffers() {
    const res = getResolution(this.gl, this.config.SUNRAYS_RESOLUTION);

    const texType = this.ext.halfFloatTexType;
    const r = this.ext.formatR;
    const filtering = this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST;

    this.sunrays     = createFBO(this.gl, res.width, res.height, r.internalFormat, r.format, texType, filtering);
    this.sunraysTemp = createFBO(this.gl, res.width, res.height, r.internalFormat, r.format, texType, filtering);
  }

  updateKeywords() {
    const displayKeywords = [];
    if (this.config.SHADING) { displayKeywords.push('SHADING'); }
    if (this.config.BLOOM) { displayKeywords.push('BLOOM'); }
    if (this.config.SUNRAYS) { displayKeywords.push('SUNRAYS'); }
    this.displayMaterial.setKeywords(displayKeywords);
  }

  update() {
    if (this.destroyed || this.hidden) { return; }
    const dt = this.calcDeltaTime();
    if (this.resizeCanvas(this.canvas)) {
      this.initFramebuffers();
    }

    this.updateColors(dt);
    this.applyInputs();
    if (!this.config.PAUSED) {
      this.step(dt);
    }

    this.render(null);
    requestAnimationFrame(() => {
      this.update();
    });
  }

  addRandomPoints() {
    if (!this.config.PAUSED && this.config.ADD_SPLASHES_IN_RANDOM_INTERVALS && !this.hidden) {
      this.splatStack.push(Math.floor(Math.random() * 20) + 5);
    }

    const waitTime = Math.floor(Math.random() * 10000);
    setTimeout(() => {
      this.addRandomPoints();
    }, waitTime);
  }

  calcDeltaTime() {
    const now = Date.now();
    let dt = (now - this.lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    this.lastUpdateTime = now;
    return dt;
  }

  resizeCanvas(canvas: HTMLCanvasElement) {
    // todo: this seems to increase infinitely the canvas size,
    // wheras it shouldnt.
    const width = scaleByPixelRatio(window.innerWidth);
    const height = scaleByPixelRatio(window.innerHeight);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  updateColors(dt) {
    if (!this.config.COLORFUL) { return; }

    this.colorUpdateTimer += dt * this.config.COLOR_UPDATE_SPEED;
    if (this.colorUpdateTimer >= 1) {
      this.colorUpdateTimer = wrap(this.colorUpdateTimer, 0, 1);
      this.pointers.forEach(p => {
        p.color = generateColor();
      });
    }
  }

  applyInputs() {
    if (this.splatStack.length > 0) {
      this.multipleSplats(this.splatStack.pop());
    }

    this.pointers.forEach(p => {
      if (p.moved) {
        p.moved = false;
        this.splatPointer(p);
      }
    });
  }

  step(dt) {
    this.gl.disable(this.gl.BLEND);
    this.gl.viewport(0, 0, this.velocity.width, this.velocity.height);

    this.curlProgram.bind();
    this.gl.uniform2f(this.curlProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.curl.fbo);

    this.vorticityProgram.bind();
    this.gl.uniform2f(this.vorticityProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl.attach(1));
    this.gl.uniform1f(this.vorticityProgram.uniforms.curl, this.config.CURL);
    this.gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.divergenceProgram.bind();
    this.gl.uniform2f(this.divergenceProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.blit(this.divergence.fbo);

    this.clearProgram.bind();
    this.gl.uniform1i(this.clearProgram.uniforms.uTexture, this.pressure.read.attach(0));
    this.gl.uniform1f(this.clearProgram.uniforms.value, this.config.PRESSURE);
    this.blit(this.pressure.write.fbo);
    this.pressure.swap();

    this.pressureProgram.bind();
    this.gl.uniform2f(this.pressureProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence.attach(0));
    for (let i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
      this.gl.uniform1i(this.pressureProgram.uniforms.uPressure, this.pressure.read.attach(1));
      this.blit(this.pressure.write.fbo);
      this.pressure.swap();
    }

    this.gradientSubtractProgram.bind();
    this.gl.uniform2f(this.gradientSubtractProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    this.gl.uniform1i(this.gradientSubtractProgram.uniforms.uPressure, this.pressure.read.attach(0));
    this.gl.uniform1i(this.gradientSubtractProgram.uniforms.uVelocity, this.velocity.read.attach(1));
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.advectionProgram.bind();
    this.gl.uniform2f(this.advectionProgram.uniforms.texelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    if (!this.ext.supportLinearFiltering) {
      this.gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.velocity.texelSizeX, this.velocity.texelSizeY);
    }
    const velocityId = this.velocity.read.attach(0);
    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, velocityId);
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, velocityId);
    this.gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.VELOCITY_DISSIPATION);
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.gl.viewport(0, 0, this.dye.width, this.dye.height);

    if (!this.ext.supportLinearFiltering) {
      this.gl.uniform2f(this.advectionProgram.uniforms.dyeTexelSize, this.dye.texelSizeX, this.dye.texelSizeY);
    }
    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read.attach(0));
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.dye.read.attach(1));
    this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.DENSITY_DISSIPATION);
    this.blit(this.dye.write.fbo);
    this.dye.swap();
  }

  render(target) {
    if (this.config.BLOOM) {
      this.applyBloom(this.dye.read, this.bloom);
    }
    if (this.config.SUNRAYS) {
      this.applySunrays(this.dye.read, this.dye.write, this.sunrays);
      this.blur(this.sunrays, this.sunraysTemp, 1);
    }

    if (target == null || !this.config.TRANSPARENT) {
      this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      this.gl.enable(this.gl.BLEND);
    } else {
      this.gl.disable(this.gl.BLEND);
    }

    const width = target == null ? this.gl.drawingBufferWidth : target.width;
    const height = target == null ? this.gl.drawingBufferHeight : target.height;
    this.gl.viewport(0, 0, width, height);

    const fbo = target == null ? null : target.fbo;
    if (!this.config.TRANSPARENT) {
      this.drawColor(fbo, normalizeColor(this.config.BACK_COLOR));
    }
    if (target == null && this.config.TRANSPARENT) {
      this.drawCheckerboard(fbo);
    }
    this.drawDisplay(fbo, width, height);
  }

  drawColor(fbo, color) {
    this.colorProgram.bind();
    this.gl.uniform4f(this.colorProgram.uniforms.color, color.r, color.g, color.b, 1);
    this.blit(fbo);
  }

  drawCheckerboard(fbo) {
    this.checkerboardProgram.bind();
    this.gl.uniform1f(this.checkerboardProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    this.blit(fbo);
  }

  drawDisplay(fbo, width, height) {
    this.displayMaterial.bind();
    if (this.config.SHADING) {
      this.gl.uniform2f(this.displayMaterial.uniforms.texelSize, 1.0 / width, 1.0 / height);
    }
    this.gl.uniform1i(this.displayMaterial.uniforms.uTexture, this.dye.read.attach(0));
    if (this.config.BLOOM) {
      this.gl.uniform1i(this.displayMaterial.uniforms.uBloom, this.bloom.attach(1));
    }
    if (this.config.DITHERING_TEXTURE && !!this.ditheringTexture) {
      this.gl.uniform1i(this.displayMaterial.uniforms.uDithering, this.ditheringTexture.attach(2));
      const scale = getTextureScale(this.ditheringTexture, width, height);
      this.gl.uniform2f(this.displayMaterial.uniforms.ditherScale, scale.x, scale.y);
    }
    if (this.config.SUNRAYS) {
      this.gl.uniform1i(this.displayMaterial.uniforms.uSunrays, this.sunrays.attach(3));
    }
    this.blit(fbo);
  }

  applyBloom(source, destination) {
    if (this.bloomFramebuffers.length < 2) {
      return;
    }

    let last = destination;

    this.gl.disable(this.gl.BLEND);
    this.bloomPrefilterProgram.bind();
    const knee = this.config.BLOOM_THRESHOLD * this.config.BLOOM_SOFT_KNEE + 0.0001;
    const curve0 = this.config.BLOOM_THRESHOLD - knee;
    const curve1 = knee * 2;
    const curve2 = 0.25 / knee;
    this.gl.uniform3f(this.bloomPrefilterProgram.uniforms.curve, curve0, curve1, curve2);
    this.gl.uniform1f(this.bloomPrefilterProgram.uniforms.threshold, this.config.BLOOM_THRESHOLD);
    this.gl.uniform1i(this.bloomPrefilterProgram.uniforms.uTexture, source.attach(0));
    this.gl.viewport(0, 0, last.width, last.height);
    this.blit(last.fbo);

    this.bloomBlurProgram.bind();
    for (let i = 0; i < this.bloomFramebuffers.length; i++) { // tslint:disable-line
      const dest = this.bloomFramebuffers[i];
      this.gl.uniform2f(this.bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      this.gl.uniform1i(this.bloomBlurProgram.uniforms.uTexture, last.attach(0));
      this.gl.viewport(0, 0, dest.width, dest.height);
      this.blit(dest.fbo);
      last = dest;
    }

    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);
    this.gl.enable(this.gl.BLEND);

    for (let i = this.bloomFramebuffers.length - 2; i >= 0; i--) {
      const baseTex = this.bloomFramebuffers[i];
      this.gl.uniform2f(this.bloomBlurProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
      this.gl.uniform1i(this.bloomBlurProgram.uniforms.uTexture, last.attach(0));
      this.gl.viewport(0, 0, baseTex.width, baseTex.height);
      this.blit(baseTex.fbo);
      last = baseTex;
    }

    this.gl.disable(this.gl.BLEND);
    this.bloomFinalProgram.bind();
    this.gl.uniform2f(this.bloomFinalProgram.uniforms.texelSize, last.texelSizeX, last.texelSizeY);
    this.gl.uniform1i(this.bloomFinalProgram.uniforms.uTexture, last.attach(0));
    this.gl.uniform1f(this.bloomFinalProgram.uniforms.intensity, this.config.BLOOM_INTENSITY);
    this.gl.viewport(0, 0, destination.width, destination.height);
    this.blit(destination.fbo);
  }

  applySunrays(source, mask, destination) {
    this.gl.disable(this.gl.BLEND);
    this.sunraysMaskProgram.bind();
    this.gl.uniform1i(this.sunraysMaskProgram.uniforms.uTexture, source.attach(0));
    this.gl.viewport(0, 0, mask.width, mask.height);
    this.blit(mask.fbo);

    this.sunraysProgram.bind();
    this.gl.uniform1f(this.sunraysProgram.uniforms.weight, this.config.SUNRAYS_WEIGHT);
    this.gl.uniform1i(this.sunraysProgram.uniforms.uTexture, mask.attach(0));
    this.gl.viewport(0, 0, destination.width, destination.height);
    this.blit(destination.fbo);
  }

  blur(target, temp, iterations) {
    this.blurProgram.bind();
    for (let i = 0; i < iterations; i++) {
      this.gl.uniform2f(this.blurProgram.uniforms.texelSize, target.texelSizeX, 0.0);
      this.gl.uniform1i(this.blurProgram.uniforms.uTexture, target.attach(0));
      this.blit(temp.fbo);

      this.gl.uniform2f(this.blurProgram.uniforms.texelSize, 0.0, target.texelSizeY);
      this.gl.uniform1i(this.blurProgram.uniforms.uTexture, temp.attach(0));
      this.blit(target.fbo);
    }
  }

  splatPointer(pointer) {
    const dx = pointer.deltaX * this.config.SPLAT_FORCE;
    const dy = pointer.deltaY * this.config.SPLAT_FORCE;
    this.splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  multipleSplats(amount) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      this.splat(x, y, dx, dy, color);
    }
  }

  splat(x, y, dx, dy, color) {
    this.gl.viewport(0, 0, this.velocity.width, this.velocity.height);
    this.splatProgram.bind();
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read.attach(0));
    this.gl.uniform1f(this.splatProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    this.gl.uniform2f(this.splatProgram.uniforms.point, x, y);
    this.gl.uniform3f(this.splatProgram.uniforms.color, dx, dy, 0.0);
    this.gl.uniform1f(this.splatProgram.uniforms.radius, correctRadius(this.canvas, this.config.SPLAT_RADIUS / 100.0));
    this.blit(this.velocity.write.fbo);
    this.velocity.swap();

    this.gl.viewport(0, 0, this.dye.width, this.dye.height);
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.dye.read.attach(0));
    this.gl.uniform3f(this.splatProgram.uniforms.color, color.r, color.g, color.b);
    this.blit(this.dye.write.fbo);
    this.dye.swap();
  }

  captureScreenshot() {
    const res = getResolution(this.gl, this.config.CAPTURE_RESOLUTION);
    const target = createFBO(this.gl, res.width, res.height, this.ext.formatRGBA.internalFormat, this.ext.formatRGBA.format, this.ext.halfFloatTexType, this.gl.NEAREST);
    this.render(target);

    let texture: Float32Array | Uint8Array = framebufferToTexture(target, this.gl);
    texture = normalizeTexture(texture, target.width, target.height);

    const captureCanvas = textureToCanvas(texture, target.width, target.height);
    const datauri = captureCanvas.toDataURL();
    downloadURI(`${this.config.SCREENSHOT_FILE_NAME}.png`, datauri);
    URL.revokeObjectURL(datauri);
  }

  private handleMouseDown = (e: MouseEvent) => {
    const posX = scaleByPixelRatio(e.offsetX);
    const posY = scaleByPixelRatio(e.offsetY);
    let pointer = this.pointers.find(p => p.id === -1);
    if (pointer === null) {
      pointer = new PointerPrototype();
    }
    updatePointerDownData(this.canvas, pointer, -1, posX, posY);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === this.config.PAUSE_KEY_CODE) {
      this.config.PAUSED = !this.config.PAUSED;
    }
    if (e.key === this.config.SPLASH_KEY) {
      this.splatStack.push(Math.floor(Math.random() * 20) + 5);
    }
    if (e.code === this.config.SCREENSHOT_KEY_CODE) {
      this.captureScreenshot();
    }
  }

}
