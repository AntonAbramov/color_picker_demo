import { rgbaToHex } from "../../helpers/colorHelpers";

const COLOR_SPACE = "srgb";

export const pickColor = (
  x: number,
  y: number,
  context: CanvasRenderingContext2D
): string => {
  const imageData = context.getImageData(x, y, 1, 1, {
    colorSpace: COLOR_SPACE,
  });

  // @ts-ignore
  const [r, g, b] = imageData.data;
  return rgbaToHex(r, g, b);
};

export const getImageDataForColorPickerPreview = (
  x: number,
  y: number,
  width: number,
  height: number,
  context: CanvasRenderingContext2D
) => {
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);

  return context.getImageData(x - halfWidth, y - halfHeight, width, height, {
    colorSpace: COLOR_SPACE,
  });
};

export const drawLines = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  pixelSize: number
) => {
  context.lineWidth = 0.5;
  context.strokeStyle = "#cccccc";

  for (let row = 0; row < height; row++) {
    context.beginPath();
    context.moveTo(0, row * pixelSize);
    context.lineTo(width * pixelSize, row * pixelSize);
    context.stroke();
  }

  for (let col = 0; col < width; col++) {
    context.beginPath();
    context.moveTo(col * pixelSize, 0);
    context.lineTo(col * pixelSize, height * pixelSize);
    context.stroke();
  }
};
