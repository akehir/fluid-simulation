import { correctDeltaX } from './correct-delta-x';
import { correctDeltaY } from './correct-delta-y';

export function updatePointerMoveData(canvas: HTMLCanvasElement, pointer, posX, posY) {
  pointer.prevTexcoordX = pointer.texcoordX;
  pointer.prevTexcoordY = pointer.texcoordY;
  pointer.texcoordX = posX / canvas.width;
  pointer.texcoordY = 1.0 - posY / canvas.height;
  pointer.deltaX = correctDeltaX(canvas, pointer.texcoordX - pointer.prevTexcoordX);
  pointer.deltaY = correctDeltaY(canvas, pointer.texcoordY - pointer.prevTexcoordY);
  pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
}
