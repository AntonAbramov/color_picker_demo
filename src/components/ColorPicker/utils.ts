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
  context: CanvasRenderingContext2D
) => {
  return context.getImageData(x - 10, y - 10, 20, 20, {
    colorSpace: COLOR_SPACE,
  });
};
