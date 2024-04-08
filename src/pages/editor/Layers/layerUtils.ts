import { Rect } from "./layerTypes";

export const drawEditRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  if (!ctx) {
    return;
  }
  ctx.strokeStyle = "#f3f3f3";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y + height);
  ctx.moveTo(x, y + height);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.stroke();
  ctx.closePath();
};

export const getDivLayerBoundaryNewRect = (
  layerRect: Rect,
  canvasWidth: number,
  canvasHeight: number
): Rect => {
  let rectWidth = layerRect.width;
  let rectHeight = layerRect.height;

  let rectX = layerRect.x;
  let rectY = layerRect.y;

  if (rectX < 0) {
    rectWidth += rectX;
    rectX = 0;
  }
  if (rectWidth + rectX > canvasWidth) {
    const part = rectWidth + rectX - canvasWidth;
    rectWidth -= part;
  }

  if (rectY < 0) {
    rectHeight += rectY;
    rectY = 0;
  }
  if (rectHeight + rectY > canvasHeight) {
    const part = rectHeight + rectY - canvasHeight;
    rectHeight -= part;
  }

  return {
    width: rectWidth,
    height: rectHeight,
    x: rectX,
    y: rectY,
  };
};
