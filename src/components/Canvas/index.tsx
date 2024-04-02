export interface CanvasProps {
  className?: string;
  onParentRef?: (ref: HTMLCanvasElement | null) => void;
  onRef?: (ref: HTMLCanvasElement | null) => void;
}

export const CanvasComponent = ({
  className,
  onRef,
  onParentRef,
}: CanvasProps) => {
  return (
    <canvas
      className={className}
      ref={(el: HTMLCanvasElement) => {
        onParentRef && onParentRef(el);
        onRef && onRef(el);
      }}
    />
  );
};
