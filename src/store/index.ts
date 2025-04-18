import { create } from "zustand";
import { nanoid } from "nanoid";
import { BlockType, SpriteType, Position } from "@/types";
import { checkSpriteCollision } from "@/utils/sprite";

interface AppState {
  sprites: SpriteType[];
  selectedSpriteId: string | null;
  isPlaying: boolean;
  blockDefinitions: Record<string, any>;

 
  addSprite: (sprite: Partial<SpriteType>) => void;
  removeSprite: (id: string) => void;
  selectSprite: (id: string) => void;
  updateSpritePosition: (id: string, position: Position) => void;
  updateSpriteAngle: (id: string, angle: number) => void;
  setSpriteMessage: (
    id: string,
    text: string,
    type: "say" | "think",
    duration: number
  ) => void;

 
  addBlockToSprite: (spriteId: string, block: BlockType) => void;
  removeBlockFromSprite: (spriteId: string, blockId: string) => void;
  updateBlockParams: (
    spriteId: string,
    blockId: string,
    params: Record<string, any>
  ) => void;

  
  setPlaying: (isPlaying: boolean) => void;

  
  checkCollisions: () => void;
  swapAnimations: (spriteId1: string, spriteId2: string) => void;
}

const defaultCat = {
  id: nanoid(),
  name: "Cat",
  position: { x: 0, y: 0 },
  image: "/cat.svg",
  width: 95,
  height: 100,
  angle: 0,
  messages: [],
  scripts: [],
};

export const useAppStore = create<AppState>((set, get) => ({
  sprites: [defaultCat],
  selectedSpriteId: defaultCat.id,
  isPlaying: false,
  blockDefinitions: {
    moveSteps: {
      type: "moveSteps",
      category: "motion",
      label: "Move ____ steps",
      paramFields: [{ name: "steps", type: "number", default: 10 }],
    },
    turnDegrees: {
      type: "turnDegrees",
      category: "motion",
      label: "Turn ____ degrees",
      paramFields: [{ name: "degrees", type: "number", default: 15 }],
    },
    goToXY: {
      type: "goToXY",
      category: "motion",
      label: "Go to x: ____ y: ____",
      paramFields: [
        { name: "x", type: "number", default: 0 },
        { name: "y", type: "number", default: 0 },
      ],
    },
    repeat: {
      type: "repeat",
      category: "control",
      label: "Repeat",
      hasChildren: true,
    },
    say: {
      type: "say",
      category: "looks",
      label: "Say ____ for ____ seconds",
      paramFields: [
        { name: "text", type: "text", default: "Hello!" },
        { name: "duration", type: "number", default: 2 },
      ],
    },
    think: {
      type: "think",
      category: "looks",
      label: "Think ____ for ____ seconds",
      paramFields: [
        { name: "text", type: "text", default: "Hmm..." },
        { name: "duration", type: "number", default: 2 },
      ],
    },
  },

  addSprite: (sprite) =>
    set((state) => {
      const newSprite: SpriteType = {
        id: nanoid(),
        name: `Sprite${state.sprites.length + 1}`,
        position: { x: 0, y: 0 },
        image: "/cat.svg",
        width: 95,
        height: 100,
        angle: 0,
        messages: [],
        scripts: [],
        ...sprite,
      };

      return {
        sprites: [...state.sprites, newSprite],
        selectedSpriteId: newSprite.id,
      };
    }),

  removeSprite: (id) =>
    set((state) => {
      const sprites = state.sprites.filter((sprite) => sprite.id !== id);
      const selectedSpriteId =
        state.selectedSpriteId === id
          ? sprites.length > 0
            ? sprites[0].id
            : null
          : state.selectedSpriteId;

      return { sprites, selectedSpriteId };
    }),

  selectSprite: (id) => set({ selectedSpriteId: id }),

  updateSpritePosition: (id, position) =>
    set((state) => ({
      sprites: state.sprites.map((sprite) =>
        sprite.id === id ? { ...sprite, position } : sprite
      ),
    })),

  updateSpriteAngle: (id, angle) =>
    set((state) => ({
      sprites: state.sprites.map((sprite) =>
        sprite.id === id ? { ...sprite, angle } : sprite
      ),
    })),

  setSpriteMessage: (id, text, type, duration) =>
    set((state) => {
      
      const sprite = state.sprites.find((s) => s.id === id);
      if (sprite) {
        sprite.messages.forEach((msg) => {
          if (msg.timeoutId) {
            window.clearTimeout(msg.timeoutId);
          }
        });
      }

      const timeoutId = window.setTimeout(() => {
        set((state) => ({
          sprites: state.sprites.map((sprite) =>
            sprite.id === id
              ? {
                  ...sprite,
                  messages: sprite.messages.map((msg) => ({
                    ...msg,
                    visible: false,
                  })),
                }
              : sprite
          ),
        }));
      }, duration * 1000);

      return {
        sprites: state.sprites.map((sprite) =>
          sprite.id === id
            ? {
                ...sprite,
                messages: [{ text, type, duration, visible: true, timeoutId }],
              }
            : sprite
        ),
      };
    }),

  addBlockToSprite: (spriteId, block) =>
    set((state) => ({
      sprites: state.sprites.map((sprite) =>
        sprite.id === spriteId
          ? { ...sprite, scripts: [...sprite.scripts, block] }
          : sprite
      ),
    })),

  removeBlockFromSprite: (spriteId, blockId) =>
    set((state) => ({
      sprites: state.sprites.map((sprite) =>
        sprite.id === spriteId
          ? {
              ...sprite,
              scripts: sprite.scripts.filter((script) => script.id !== blockId),
            }
          : sprite
      ),
    })),

  updateBlockParams: (spriteId, blockId, params) =>
    set((state) => {
      console.log("Updating block params:", spriteId, blockId, params);
      return {
        sprites: state.sprites.map((sprite) =>
          sprite.id === spriteId
            ? {
                ...sprite,
                scripts: sprite.scripts.map((block) =>
                  block.id === blockId
                    ? { ...block, params: { ...block.params, ...params } }
                    : block
                ),
              }
            : sprite
        ),
      };
    }),

  setPlaying: (isPlaying) => set({ isPlaying }),

  checkCollisions: () => {
    const { sprites, swapAnimations } = get();

    
    for (let i = 0; i < sprites.length; i++) {
      for (let j = i + 1; j < sprites.length; j++) {
        const sprite1 = sprites[i];
        const sprite2 = sprites[j];

        if (checkSpriteCollision(sprite1, sprite2)) {
          
          swapAnimations(sprite1.id, sprite2.id);

          
          console.log(
            `Collision detected between ${sprite1.name} and ${sprite2.name}!`
          );
          console.log("Scripts swapped between sprites");
        }
      }
    }
  },

  swapAnimations: (spriteId1, spriteId2) =>
    set((state) => {
      const sprite1 = state.sprites.find((s) => s.id === spriteId1);
      const sprite2 = state.sprites.find((s) => s.id === spriteId2);

      if (!sprite1 || !sprite2) return state;

      
      const scripts1 = [...sprite1.scripts];
      const scripts2 = [...sprite2.scripts];

      return {
        sprites: state.sprites.map((sprite) => {
          if (sprite.id === spriteId1) {
            return { ...sprite, scripts: scripts2 };
          } else if (sprite.id === spriteId2) {
            return { ...sprite, scripts: scripts1 };
          }
          return sprite;
        }),
      };
    }),
}));
