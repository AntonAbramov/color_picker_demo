import { useCallback, useEffect, useRef } from "react";
import { Layer } from "./Layer";
import { useEditorContext } from "../../../hooks/useEditorContext";
import { loadImageData } from "../../../helpers/loaders";
import { drawEditRect, getDivLayerBoundaryNewRect } from "./layerUtils";
import { useLayerRectEditor } from "../../../hooks/useLayerRectEditor";
import { Rect } from "./layerTypes";

interface ImageLayerProps {
  src: string;
  id: string;
}

export const ImageLayer = ({ src, id }: ImageLayerProps) => {
  const { selectedLayerId, setSelectedLayerId, ctx, canvas, addLayer, render } =
    useEditorContext();
  const imageOptions = useRef<Rect>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
  });
  const [ref, zIndexController, draggingController] = useLayerRectEditor(
    id,
    0,
    imageOptions
  );
  const selectedLayerIdRef = useRef<string | undefined>(selectedLayerId);

  useEffect(() => {
    selectedLayerIdRef.current = selectedLayerId;
    render();
  }, [selectedLayerId]);

  useEffect(() => {
    if (!ctx || !canvas) return;

    loadImageData(src).then((image) => {
      if (!image) {
        alert("Image not loaded.");
        return;
      }

      const aspectRatio = image.width / image.height;
      const currentImageWidth =
        canvas.width < image.width ? canvas.width : image.width;
      imageOptions.current = {
        width: currentImageWidth,
        height: currentImageWidth / aspectRatio,
        x: 0,
        y: 0,
      };

      addLayer({
        id,
        render: (zIndex) => {
          drawImage(image);
          zIndexController.setZIndex(zIndex);
        },
      });
      render();
    });
  }, [ctx]);

  const drawImage = (image: HTMLImageElement) => {
    const container = ref.current;
    if (!ctx || !canvas || !container) return;

    const width = imageOptions.current.width;
    const height = imageOptions.current.height;

    const {
      width: rectWidth,
      height: rectHeight,
      x: rectX,
      y: rectY,
    } = getDivLayerBoundaryNewRect(
      {
        x: imageOptions.current.x,
        y: imageOptions.current.y,
        width: imageOptions.current.width,
        height: imageOptions.current.height,
      },
      canvas.width,
      canvas.height
    );

    container.style.width = `${rectWidth}px`;
    container.style.height = `${rectHeight}px`;

    container.style.transform = `translate(${rectX}px, ${rectY}px)`;

    ctx.drawImage(
      image,
      imageOptions.current.x,
      imageOptions.current.y,
      width,
      height
    );

    if (selectedLayerIdRef.current === id) {
      drawEditRect(
        ctx,
        imageOptions.current.x,
        imageOptions.current.y,
        width,
        height
      );
    }
  };

  const onSelect = useCallback(() => {
    draggingController.setIsDragging(false);
    if (draggingController.isDragging) {
      return;
    }

    setSelectedLayerId(selectedLayerId === id ? undefined : id);
  }, [selectedLayerId, id, draggingController.isDragging]);

  return (
    <Layer
      ref={ref}
      id={id}
      style={{
        zIndex: zIndexController.zIndex,
        cursor: selectedLayerId === id ? "grab" : undefined,
      }}
      onSelect={onSelect}
    />
  );
};
