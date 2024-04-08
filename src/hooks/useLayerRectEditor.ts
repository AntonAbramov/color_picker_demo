import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "./useEditorContext";
import { Rect } from "../pages/editor/Layers/layerTypes";

type LayerRectEditorHookParams = [
  RefObject<HTMLDivElement>,
  { zIndex: number; setZIndex: (zIndex: number) => void },
  { isDragging: boolean; setIsDragging: (isDragging: boolean) => void }
];

export const useLayerRectEditor = (
  id: string,
  argZIndex: number = 0,
  imageOptions: MutableRefObject<Rect>
): LayerRectEditorHookParams => {
  const { render, canvas, selectedLayerId, scale } = useEditorContext();
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [zIndex, setZIndex] = useState<number>(argZIndex);

  useEffect(() => {
    const container = ref.current;
    if (!container || !canvas || selectedLayerId !== id) return;

    const mousedown = (event: MouseEvent) => {
      container.style.cursor = "grabbing";
      let x = event.clientX;
      let y = event.clientY;

      container.style.zIndex = "999";

      const mousemove = (event: MouseEvent) => {
        setIsDragging(true);

        const dx = (event.clientX - x) / scale;
        const dy = (event.clientY - y) / scale;

        x = event.clientX;
        y = event.clientY;

        imageOptions.current.x += dx;
        imageOptions.current.y += dy;

        render();
      };
      container.addEventListener("mousemove", mousemove);
      const stopListen = () => {
        container.style.zIndex = `${zIndex}`;

        container.style.cursor = "grab";
        container.removeEventListener("mousemove", mousemove);
        container.removeEventListener("mouseup", stopListen);
        container.removeEventListener("mouseleave", stopListen);
      };
      container.addEventListener("mouseup", stopListen);
      container.addEventListener("mouseleave", stopListen);
    };

    const wheel = (event: WheelEvent) => {
      event.stopPropagation();
      event.preventDefault();
      const deltaY = event.deltaY > 0 ? 1 : -1;

      const aspectRatio =
        imageOptions.current.width / imageOptions.current.height;
      const step = 20 * deltaY;
      const newWidth = imageOptions.current.width + step;
      const newHeight = imageOptions.current.height + step / aspectRatio;
      imageOptions.current.width = newWidth;
      imageOptions.current.height = newHeight;

      render();
    };
    render();

    container.addEventListener("mousedown", mousedown);
    container.addEventListener("wheel", wheel);

    return () => {
      container.removeEventListener("mousedown", mousedown);
      container.removeEventListener("wheel", wheel);
    };
  }, [ref, selectedLayerId, zIndex, scale]);

  return [ref, { zIndex, setZIndex }, { isDragging, setIsDragging }];
};
