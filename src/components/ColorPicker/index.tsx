import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { CanvasProps } from "../Canvas";
import { PickerPreview, PickerPreviewRefInterface } from "./PickerPreview";
import { PIXEL_RATIO } from "../../constants/dimensions";
import { getImageDataForColorPickerPreview, pickColor } from "./utils";
import styles from "./colorPicker.module.css";

interface ColorPickerProps {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onColor: (hex: string | undefined) => void;
}

export const ColorPicker = ({
  children,
  disabled,
  loading,
  onColor,
}: ColorPickerProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const previewHelperRef = useRef<PickerPreviewRefInterface | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  const mouseEnter = (context: CanvasRenderingContext2D) => {
    const container = ref.current;
    if (!container) {
      return;
    }
    setPreviewVisible(true);

    let currentColor: string | undefined;
    container.onclick = () => {
      onColor(currentColor);
      setPreviewVisible(false);
    };
    const mouseMove = (event: MouseEvent) => {
      const x = event.offsetX;
      const y = event.offsetY;

      const canvasX = x * PIXEL_RATIO;
      const canvasY = y * PIXEL_RATIO;

      const color = pickColor(canvasX, canvasY, context);
      currentColor = color;
      const imageData = getImageDataForColorPickerPreview(
        canvasX,
        canvasY,
        context
      );

      previewHelperRef.current?.setImageData &&
        previewHelperRef.current?.setImageData(imageData);
      previewHelperRef.current?.setPosition &&
        previewHelperRef.current?.setPosition(x, y);
      previewHelperRef.current?.setColor &&
        previewHelperRef.current?.setColor(color);
    };

    container.addEventListener("mousemove", mouseMove);

    const mouseLeave = () => {
      setPreviewVisible(false);
      container.removeEventListener("mousemove", mouseMove);
      container.removeEventListener("mouseleave", mouseLeave);
    };
    container.addEventListener("mouseleave", mouseLeave);
  };

  useEffect(() => {
    if (disabled) {
      return;
    }

    const container = ref.current;
    if (!canvas || !previewHelperRef.current || !container) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const handler = () => {
      mouseEnter(context);
    };
    container.addEventListener("mouseenter", handler);

    return () => {
      container.removeEventListener("mouseenter", handler);
    };
  }, [canvas, previewHelperRef.current, disabled]);

  const childrenElement = useMemo(() => {
    return loading
      ? null
      : React.cloneElement<CanvasProps>(children as any, {
          onParentRef: (el: HTMLCanvasElement | null) => {
            setCanvas(el);
          },
        });
  }, [loading]);

  return (
    <div className={styles.container}>
      {!disabled && <div ref={ref} className={styles.mask} />}
      {childrenElement}
      <PickerPreview
        visible={previewVisible}
        width={15}
        height={15}
        pixelSize={15}
        ref={previewHelperRef}
      />
    </div>
  );
};
