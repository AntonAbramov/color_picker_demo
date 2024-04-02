export const loadImageData = (url: string) => {
  return new Promise<HTMLImageElement | undefined>((resolve) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      resolve(undefined);
    };
    image.src = url;
  });
};
