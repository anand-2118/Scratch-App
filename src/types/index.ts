
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
    type: 'say' | 'think';
    duration: number;
    visible: boolean;
    timeoutId?: number;
  }[];
  scripts: BlockType[];
};

export type BlockCategory = 'motion' | 'looks' | 'control';

export type BlockType = {
  id: string;
  type: string;
  category: BlockCategory;
  params: Record<string, any>;
  children?: BlockType[];
};

export type BlockDefinition = {
  type: string;
  category: BlockCategory;
  label: string;
  paramFields?: {
    name: string;
    type: 'number' | 'text';
    default: any;
    label?: string;
  }[];
  hasChildren?: boolean;
};
