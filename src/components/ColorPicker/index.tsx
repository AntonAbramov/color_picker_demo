import React, {
  ForwardedRef,
  forwardRef,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useEditorContext } from "../../hooks/useEditorContext";
import { PickerPreview, PickerPreviewRefInterface } from "./PickerPreview";
import { getImageDataForColorPickerPreview, pickColor } from "./utils";
import styles from "./colorPicker.module.css";

interface ColorPickerProps {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onColor: (hex: string | undefined) => void;
}

const PICKER_WIDTH = 15;
const PICKER_HEIGHT = 15;
export const ColorPicker = forwardRef(
  (
    { children, disabled, onColor }: ColorPickerProps,
    colorPickerRef: ForwardedRef<HTMLDivElement>
  ) => {
    const { ctx } = useEditorContext();
    const ref = useRef<HTMLDivElement | null>(null);
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

        const color = pickColor(x, y, context);
        currentColor = color;
        const imageData = getImageDataForColorPickerPreview(
          x,
          y,
          PICKER_WIDTH,
          PICKER_HEIGHT,
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
      if (!ctx || !previewHelperRef.current || !container) return;

      const handler = () => {
        mouseEnter(ctx);
      };
      container.addEventListener("mouseenter", handler);

      return () => {
        container.removeEventListener("mouseenter", handler);
      };
    }, [ctx, previewHelperRef, disabled]);

    return (
      <div ref={colorPickerRef} className={styles.container}>
        {!disabled && <div ref={ref} className={styles.mask} />}
        {children}
        <PickerPreview
          visible={previewVisible}
          width={PICKER_WIDTH}
          height={PICKER_HEIGHT}
          pixelSize={10}
          ref={previewHelperRef}
        />
      </div>
    );
  }
);
