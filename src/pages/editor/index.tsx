import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import { ImageLayer } from "./Layers/ImageLayer";
import { ColorPicker } from "../../components/ColorPicker";
import { EditorCanvas } from "../../components/EditorCanvas";
import { useEditorContext } from "../../hooks/useEditorContext";
import Image from "../../assets/images/image.jpg";
import OtherImage from "../../assets/images/test.webp";
import { ReactComponent as ColorPickerIcon } from "../../assets/icons/IconColorPicker.svg";
import styles from "./editor.module.css";

const CANVAS_SIZE = {
  width: 800,
  height: 600,
};
const Editor = () => {
  const { setScale, scale: contextScale } = useEditorContext();
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [pickedColor, setPickedColor] = useState<string>();
  const [disabled, setDisabled] = useState(true);
  const scale = useRef<number>(contextScale);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = canvasContainerRef.current;
    const colorPickerContainer = colorPickerRef.current;
    if (!container || !colorPickerContainer) {
      return;
    }

    let scrollTop = container.scrollTop;
    let scrollLeft = container.scrollLeft;
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
        const deltaY = event.deltaY > 0 ? 1 : -1;

        scale.current += 0.1 * deltaY;

        scrollTop = event.offsetY * scale.current - event.offsetY;
        scrollLeft = event.offsetX * scale.current - event.offsetX;

        container.scrollTo({
          top: scrollTop,
          left: scrollLeft,
        });
        colorPickerContainer.style.scale = `${scale.current}`;
        setScale(scale.current);
      }
    };
    container.addEventListener("wheel", wheel);

    return () => {
      container.removeEventListener("wheel", wheel);
    };
  }, [canvasContainerRef.current]);

  const onColor = (hex: string | undefined) => {
    setPickedColor(hex);
    setDisabled(true);
  };

  const toggleColorPicker = () => {
    setDisabled((prev) => !prev);
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.canvasContainer} ref={canvasContainerRef}>
        <ColorPicker
          ref={colorPickerRef}
          disabled={disabled}
          loading={false}
          onColor={onColor}
        >
          <EditorCanvas
            className={styles.canvas}
            width={CANVAS_SIZE.width}
            height={CANVAS_SIZE.height}
          >
            <ImageLayer id="Image layer" src={Image} />
            <ImageLayer id="Test" src={OtherImage} />
          </EditorCanvas>
        </ColorPicker>
      </div>
    </div>
  );
};

export default Editor;
