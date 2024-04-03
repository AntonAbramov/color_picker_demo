import { ReactNode, useEffect } from "react";
import cn from "classnames";
import { useEditorContext } from "../../hooks/useEditorContext";
import styles from "./editorCanvas.module.css";

export interface CanvasProps {
  width: number;
  height: number;
  className?: string;
  onRef?: (ref: HTMLCanvasElement | null) => void;
  children?: ReactNode | ReactNode[];
}

export const EditorCanvas = ({
  width,
  height,
  className,
  onRef: propsOnRef,
  children,
}: CanvasProps) => {
  const { setCtx, ctx, setCanvas, canvas } = useEditorContext();

  useEffect(() => {
    if (!ctx || !canvas) {
      return;
    }
  }, [ctx, canvas]);

  const onRef = (el: HTMLCanvasElement) => {
    if (!el) {
      return;
    }
    propsOnRef && propsOnRef(el);

    const ctx = el.getContext("2d");
    if (!ctx) {
      alert("Cannot get canvas context !!!");
      return;
    }
    setCanvas(el);
    setCtx(ctx);
  };

  return (
    <>
      <canvas
        width={width}
        height={height}
        className={cn(styles.canvas, className)}
        ref={onRef}
      />
      {children}
    </>
  );
};
