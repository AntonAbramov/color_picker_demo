import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "../../../hooks/useEditorContext";
import { drawLines } from "../utils";
import styles from "./pickerPreview.module.css";

interface PickerPreviewProps {
  visible: boolean;
  pixelSize: number;
  width: number;
  height: number;
}

export interface PickerPreviewRefInterface {
  // (setPosition) = x -> left, y - top (these are relative coordinates to the parent container)
  setPosition?: (x: number, y: number) => void;
  setImageData?: (imageData: ImageData) => void;
  setColor?: (color: string) => void;
}

export const PickerPreview = forwardRef(
  (
    { visible, width, height, pixelSize }: PickerPreviewProps,
    ref: ForwardedRef<PickerPreviewRefInterface>
  ) => {
    const { scale } = useEditorContext();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
    const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [currentColor, setCurrentColor] = useState<string>("");

    useImperativeHandle(
      ref,
      () => {
        const container = containerRef.current;
        const canvas = canvasElementRef.current;
        if (!container || !canvas) {
          return {};
        }

        const context = canvas.getContext("2d");
        if (!context) {
          return {};
        }

        const halfWidth = (width * pixelSize) / 2;
        const halfHeight = (height * pixelSize) / 2;

        return {
          setPosition: (x: number, y: number) => {
            const top = `${y - halfWidth}px`;
            const left = `${x - halfHeight}px`;

            /*
               Using top and left is slower than transform: translate(),
               but top and left do not require scaling.
            */
            container.style.top = top;
            container.style.left = left;
          },
          setImageData: (imageData: ImageData) => {
            context.putImageData(imageData, 0, 0);
          },
          setColor: setCurrentColor,
        };
      },
      [containerRef, canvasElementRef]
    );

    useEffect(() => {
      const overlayCanvas = overlayCanvasRef.current;
      if (!overlayCanvas) {
        return;
      }
      const context = overlayCanvas.getContext("2d");
      if (context) {
        drawLines(context, width, height, pixelSize);
      }
    }, [overlayCanvasRef, width, height, pixelSize]);

    return (
      <div
        className={styles.container}
        ref={containerRef}
        style={{
          width: width * pixelSize,
          height: height * pixelSize,
          display: visible ? "block" : "none",
          scale: `${1 / scale}`,
        }}
        onMouseEnter={(e) => e.preventDefault()}
      >
        <canvas
          ref={canvasElementRef}
          width={width}
          height={height}
          className={styles.canvas}
        />
        <canvas
          ref={overlayCanvasRef}
          width={width * pixelSize}
          height={height * pixelSize}
          className={styles.overlayCanvas}
        />
        <span className={styles.currentColor}>{currentColor}</span>
        <div
          className={styles.currentPixel}
          style={{
            top: Math.floor(width / 2) * pixelSize - 2,
            left: Math.floor(height / 2) * pixelSize - 2,
            width: pixelSize,
            height: pixelSize,
          }}
        />
      </div>
    );
  }
);
