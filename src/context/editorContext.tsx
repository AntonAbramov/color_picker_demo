import { createContext, ReactNode, useRef, useState } from "react";
import { insert } from "../helpers/arrayHelpers";

export interface Layer {
  id: string;
  render: (zIndex: number) => void;
}

interface EditorContextInterface {
  layersOrder: string[];
  setLayersOrder: (layerOrder: string[]) => void;
  layers: Layer[];
  addLayer: (layer: Layer) => void;
  moveTo: (layerId: string, targetLayerId: string) => void;
  ctx?: CanvasRenderingContext2D;
  setCtx: (ctx: CanvasRenderingContext2D) => void;
  canvas?: HTMLCanvasElement;
  setCanvas: (canvas: HTMLCanvasElement) => void;
  selectedLayerId?: string;
  setSelectedLayerId: (layerId: string | undefined) => void;
  scale: number;
  setScale: (scale: number) => void;
  render: () => void;
}

const initialState: EditorContextInterface = {
  layersOrder: [],
  setLayersOrder: () => {},
  setCtx: () => {},
  setCanvas: () => {},
  layers: [],
  addLayer: () => {},
  moveTo: () => {},
  setSelectedLayerId: () => {},
  scale: 1,
  setScale: () => {},
  render: () => {},
};

export const EditorContext =
  createContext<EditorContextInterface>(initialState);

export const EditorContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const layers = useRef<Layer[]>([]);
  const layersOrder = useRef<string[]>([]);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [selectedLayerId, setSelectedLayerId] = useState<string>();
  const [scale, setScale] = useState<number>(1);

  const addLayer = (layer: Layer) => {
    layers.current.push(layer);
  };

  const moveTo = (layerId: string, targetLayerId: string) => {
    const layerIndex = layersOrder.current.findIndex((id) => id === layerId);
    const targetIndex = layersOrder.current.findIndex(
      (id) => id === targetLayerId
    );

    const [layer] = layersOrder.current.splice(layerIndex, 1);
    layersOrder.current = insert<string>(
      layersOrder.current,
      targetIndex,
      layer
    );
  };

  const render = () => {
    if (!ctx || !canvas) {
      return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    layersOrder.current.forEach((layerId, index) => {
      const layer = layers.current.find((layer) => layer.id === layerId);
      if (layer) {
        layer.render(index);
      }
    });
  };

  const setLayersOrder = (newLayersOrder: string[]) => {
    layersOrder.current = newLayersOrder;
    render();
  };

  return (
    <EditorContext.Provider
      value={{
        ctx,
        setCtx,
        canvas,
        setCanvas,
        layersOrder: layersOrder.current,
        setLayersOrder,
        layers: layers.current,
        render,
        moveTo,
        addLayer,
        selectedLayerId,
        setSelectedLayerId,
        scale,
        setScale,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};
