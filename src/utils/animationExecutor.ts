import { BlockType, SpriteType } from "@/types";
import { calculateMove } from "./sprite";

type UpdateFunctions = {
  updateSpritePosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateSpriteAngle: (id: string, angle: number) => void;
  setSpriteMessage: (
    id: string,
    text: string,
    type: "say" | "think",
    duration: number
  ) => void;
  checkCollisions: () => void;
};

const executeBlock = async (
  spriteId: string,
  block: BlockType,
  sprite: SpriteType,
  updates: UpdateFunctions
): Promise<void> => {
  let steps,
    newPosition,
    degrees,
    newAngle,
    x,
    y,
    sayText,
    sayDuration,
    thinkText,
    thinkDuration;

  switch (block.type) {
    case "moveSteps":
      steps = block.params.steps || 0;
      newPosition = calculateMove(sprite, steps);
      updates.updateSpritePosition(spriteId, newPosition);
      updates.checkCollisions();
      break;

    case "turnDegrees":
      degrees = block.params.degrees || 0;
      newAngle = sprite.angle + degrees;
      updates.updateSpriteAngle(spriteId, newAngle);
      break;

    case "goToXY":
      x = block.params.x || 0;
      y = block.params.y || 0;
      updates.updateSpritePosition(spriteId, { x, y });
      updates.checkCollisions();
      break;

    case "say":
      sayText = block.params.text || "";
      sayDuration = block.params.duration || 2;
      updates.setSpriteMessage(spriteId, sayText, "say", sayDuration);

      
      await new Promise((resolve) => setTimeout(resolve, sayDuration * 1000));
      break;

    case "think":
      thinkText = block.params.text || "";
      thinkDuration = block.params.duration || 2;
      updates.setSpriteMessage(spriteId, thinkText, "think", thinkDuration);

      
      await new Promise((resolve) => setTimeout(resolve, thinkDuration * 1000));
      break;

    case "repeat":
      if (block.children && block.children.length > 0) {
        
        for (let i = 0; i < 10; i++) {
          
          for (const childBlock of block.children) {
            await executeBlock(spriteId, childBlock, sprite, updates);

           
            updates.checkCollisions();
          }
        }
      }
      break;

    default:
      break;
  }
};


export const executeScripts = async (
  spriteId: string,
  scripts: BlockType[],
  sprite: SpriteType,
  updates: UpdateFunctions
): Promise<void> => {
  for (const block of scripts) {
    await executeBlock(spriteId, block, sprite, updates);

    
    updates.checkCollisions();
  }
};
