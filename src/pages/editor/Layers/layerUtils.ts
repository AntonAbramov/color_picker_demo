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
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
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

  let rectY = layerRect.y;
  let rectX = layerRect.x;

  if (layerRect.x < 0) {
    rectWidth += layerRect.x;
    rectX = 0;
  } else {
    if (rectWidth + layerRect.x > canvasWidth) {
      const part = rectWidth + layerRect.x - canvasWidth;
      rectWidth -= part;
    }
  }

  if (layerRect.y < 0) {
    rectHeight += layerRect.y;
    rectY = 0;
  } else {
    if (rectHeight + layerRect.y > canvasHeight) {
      const part = rectHeight + layerRect.y - canvasHeight;
      rectHeight -= part;
    }
  }

  return {
    width: rectWidth,
    height: rectHeight,
    x: rectX,
    y: rectY,
  };
};
