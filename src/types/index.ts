export type Position = {
  x: number;
  y: number;
};

export type SpriteType = {
  id: string;
  name: string;
  position: Position;
  image: string;
  width: number;
  height: number;
  angle: number;
  messages: {
    text: string;
    type: "say" | "think";
    duration: number;
    visible: boolean;
    timeoutId?: number;
  }[];
  scripts: BlockType[];
};

export type BlockCategory = "motion" | "looks" | "control";

export type BlockParams = {
  steps?: number;
  degrees?: number;
  x?: number;
  y?: number;
  text?: string;
  duration?: number;
  times?: number;
};

export type BlockType = {
  id: string;
  type: string;
  category: BlockCategory;
  params: BlockParams;
  children?: BlockType[];
};

export type BlockDefinition = {
  type: string;
  category: BlockCategory;
  label: string;
  paramFields?: {
    name: string;
    type: "number" | "text";
    default: string | number;
    label?: string;
  }[];
  hasChildren?: boolean;
};
