import { useCallback } from "react";
import { useAppStore } from "@/store";
import { BlockType, SpriteType } from "@/types";
import {
  calculateVerticalMove,
  calculateHorizontalMove,
  STAGE_WIDTH,
  STAGE_HEIGHT,
} from "@/utils/sprite";

export const useAnimationExecution = () => {
  const updateSpritePosition = useAppStore(
    (state) => state.updateSpritePosition
  );
  const updateSpriteAngle = useAppStore((state) => state.updateSpriteAngle);
  const setSpriteMessage = useAppStore((state) => state.setSpriteMessage);
  const checkCollisions = useAppStore((state) => state.checkCollisions);
  const sprites = useAppStore((state) => state.sprites);

  const executeBlock = useCallback(
    async (block: BlockType, sprite: SpriteType): Promise<SpriteType> => {
      // Create a copy of the current sprite state
      let currentSprite = { ...sprite };

      switch (block.type) {
        case "moveVertical": {
          const steps = block.params?.steps || 0;
          // Calculate new position based on current sprite position
          const newPosition = calculateVerticalMove(currentSprite, steps);
          // Update position and wait for it to complete
          await new Promise<void>((resolve) => {
            updateSpritePosition(currentSprite.id, newPosition);
            // Small delay to ensure state update is complete
            setTimeout(() => {
              checkCollisions();
              resolve();
            }, 0);
          });
          currentSprite = { ...currentSprite, position: newPosition };
          break;
        }

        case "moveHorizontal": {
          const horizontalSteps = block.params?.steps || 0;
          // Calculate new position based on current sprite position
          const horizontalNewPosition = calculateHorizontalMove(
            currentSprite,
            horizontalSteps
          );
          // Update position and wait for it to complete
          await new Promise<void>((resolve) => {
            updateSpritePosition(currentSprite.id, horizontalNewPosition);
            // Small delay to ensure state update is complete
            setTimeout(() => {
              checkCollisions();
              resolve();
            }, 0);
          });
          currentSprite = { ...currentSprite, position: horizontalNewPosition };
          break;
        }

        case "turnDegrees": {
          const degrees = block.params?.degrees || 0;
          const newAngle = currentSprite.angle + degrees;
          updateSpriteAngle(currentSprite.id, newAngle);
          await new Promise((resolve) => setTimeout(resolve, 0));
          currentSprite = { ...currentSprite, angle: newAngle };
          break;
        }

        case "goToXY": {
          const x = block.params?.x || 0;
          const y = block.params?.y || 0;
          // Ensure the position is within stage bounds
          const boundedX = Math.max(
            currentSprite.width / 2,
            Math.min(x, STAGE_WIDTH - currentSprite.width / 2)
          );
          const boundedY = Math.max(
            currentSprite.height / 2,
            Math.min(y, STAGE_HEIGHT - currentSprite.height / 2)
          );
          const newPosition = { x: boundedX, y: boundedY };
          await new Promise<void>((resolve) => {
            updateSpritePosition(currentSprite.id, newPosition);
            setTimeout(() => {
              checkCollisions();
              resolve();
            }, 0);
          });
          currentSprite = { ...currentSprite, position: newPosition };
          break;
        }

        case "say": {
          const sayText = block.params?.text || "";
          const sayDuration = block.params?.duration || 2;
          setSpriteMessage(currentSprite.id, sayText, "say", sayDuration);
          await new Promise((resolve) =>
            setTimeout(resolve, sayDuration * 1000)
          );
          break;
        }

        case "think": {
          const thinkText = block.params?.text || "";
          const thinkDuration = block.params?.duration || 2;
          setSpriteMessage(currentSprite.id, thinkText, "think", thinkDuration);
          await new Promise((resolve) =>
            setTimeout(resolve, thinkDuration * 1000)
          );
          break;
        }

        case "repeat": {
          const times = block.params?.times || 1;
          for (let i = 0; i < times; i++) {
            for (const childBlock of block.children || []) {
              currentSprite = await executeBlock(childBlock, currentSprite);
              checkCollisions();
            }
          }
          break;
        }
      }

      return currentSprite;
    },
    [updateSpritePosition, updateSpriteAngle, setSpriteMessage, checkCollisions]
  );

  const executeScripts = useCallback(
    async (spriteId: string, scripts: BlockType[]): Promise<void> => {
      let currentSprite = sprites.find((s) => s.id === spriteId);

      if (!currentSprite) {
        console.error(`Sprite with id ${spriteId} not found`);
        return;
      }

      for (const block of scripts) {
        // Update the sprite reference with the latest state
        currentSprite = await executeBlock(block, currentSprite);
        checkCollisions();
      }
    },
    [executeBlock, sprites, checkCollisions]
  );

  return { executeScripts };
};
