import { CSSProperties, ForwardedRef, forwardRef } from "react";
import cn from "classnames";
import styles from "./layer.module.css";

interface LayerProps {
  id: string;
  onSelect?: () => void;
  style?: CSSProperties;
  className?: string;
}

export const Layer = forwardRef(
  (
    { id, onSelect, className, style }: LayerProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    return (
      <div
        ref={ref}
        data-attr={`layer-mask-${id}`}
        data-layer-id={id}
        style={style}
        onClick={onSelect}
        className={cn(styles.layer, className)}
      />
    );
  }
);
