import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { ColorPicker } from "./components/ColorPicker";
import { CanvasComponent } from "./components/Canvas";
import { loadImageData } from "./helpers/loaders";
import { PIXEL_RATIO } from "./constants/dimensions";
import Image from "./assets/images/image.jpg";
import { ReactComponent as ColorPickerIcon } from "./assets/icons/IconColorPicker.svg";
import styles from "./app.module.css";

function App() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const [pickedColor, setPickedColor] = useState<string>();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!canvasElement || !image || !container) {
      return;
    }
    const context = canvasElement.getContext("2d");
    if (!context) {
      return;
    }

    context.scale(PIXEL_RATIO, PIXEL_RATIO);
    const resizeHandler = () => {
      const imageAspectRatio = image.width / image.height;
      const { width } = container.getBoundingClientRect();
      const height = width / imageAspectRatio;

      canvasElement.width = width * PIXEL_RATIO;
      canvasElement.height = height * PIXEL_RATIO;
      context.drawImage(image, 0, 0, width * PIXEL_RATIO, height * PIXEL_RATIO);
    };
    window.addEventListener("resize", resizeHandler);
    resizeHandler();

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [canvasElement, image, containerRef]);

  useEffect(() => {
    loadImageData(Image)
      .then((image) => {
        if (!image) {
          return;
        }
        setImage(image);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [canvasElement]);

  const onColor = (hex: string | undefined) => {
    setPickedColor(hex);
    setDisabled(true);
  };

  const toggleColorPicker = () => {
    setDisabled((prev) => !prev);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      {loading && <span>Loading ...</span>}
      <div className={styles.header}>
        <div
          className={cn(
            styles.colorPickerButton,
            !disabled && styles.activeColorPickerButton
          )}
          onClick={toggleColorPicker}
          style={{ backgroundColor: pickedColor }}
        >
          <ColorPickerIcon />
        </div>
        {pickedColor && (
          <span className={styles.pickedColor}>{pickedColor}</span>
        )}
        <span />
      </div>
      <ColorPicker disabled={disabled} loading={loading} onColor={onColor}>
        <CanvasComponent
          onRef={(el) => {
            setCanvasElement(el);
          }}
          className={styles.canvas}
        />
      </ColorPicker>
    </div>
  );
}

export default App;
