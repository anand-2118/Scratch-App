import { BlockType, SpriteType } from "@/types";
import { calculateVerticalMove, calculateHorizontalMove } from "./sprite";
import { StoreApi } from "zustand";
import { StoreState } from "@/store";

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

export const executeBlock = async (
  block: BlockType,
  sprite: SpriteType,
  store: StoreApi<StoreState>
): Promise<SpriteType> => {
  const {
    updateSpritePosition,
    updateSpriteAngle,
    setSpriteMessage,
    checkCollisions,
  } = store.getState();

  // Create a copy of the current sprite state
  let currentSprite = { ...sprite };

  switch (block.type) {
    case "move":
      const moveDistance = block.distance || 10;
      const moveDuration = block.duration || 1000;
      const moveSteps = 20;
      const moveStepDuration = moveDuration / moveSteps;
      const moveStepDistance = moveDistance / moveSteps;

      for (let i = 0; i < moveSteps; i++) {
        const newPosition = {
          x: currentSprite.position.x + moveStepDistance,
          y: currentSprite.position.y,
        };
        updateSpritePosition(currentSprite.id, newPosition);
        currentSprite = {
          ...currentSprite,
          position: newPosition,
        };
        await new Promise((resolve) => setTimeout(resolve, moveStepDuration));
      }
      break;

    case "turn":
      const turnAngle = block.angle || 90;
      const turnDuration = block.duration || 1000;
      const turnSteps = 20;
      const turnStepDuration = turnDuration / turnSteps;
      const turnStepAngle = turnAngle / turnSteps;

      for (let i = 0; i < turnSteps; i++) {
        const newAngle = currentSprite.angle + turnStepAngle;
        updateSpriteAngle(currentSprite.id, newAngle);
        currentSprite = {
          ...currentSprite,
          angle: newAngle,
        };
        await new Promise((resolve) => setTimeout(resolve, turnStepDuration));
      }
      break;

    case "wait":
      await new Promise((resolve) =>
        setTimeout(resolve, block.duration || 1000)
      );
      break;

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

    case "goToXY": {
      const x = block.params?.x || 0;
      const y = block.params?.y || 0;
      const newPosition = { x, y };
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
      await new Promise((resolve) => setTimeout(resolve, sayDuration * 1000));
      break;
    }

    case "think": {
      const thinkText = block.params?.text || "";
      const thinkDuration = block.params?.duration || 2;
      setSpriteMessage(currentSprite.id, thinkText, "think", thinkDuration);
      await new Promise((resolve) => setTimeout(resolve, thinkDuration * 1000));
      break;
    }

    case "repeat": {
      const times = block.params?.times || 1;
      for (let i = 0; i < times; i++) {
        for (const childBlock of block.children || []) {
          currentSprite = await executeBlock(childBlock, currentSprite, store);
          checkCollisions();
        }
      }
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

    default:
      break;
  }

  return currentSprite;
};

// Execute scripts for a sprite
export const executeScripts = async (
  spriteId: string,
  scripts: BlockType[],
  store: StoreApi<StoreState>
): Promise<void> => {
  const { checkCollisions } = store.getState();
  let currentSprite = store.getState().sprites.find((s) => s.id === spriteId);

  if (!currentSprite) {
    console.error(`Sprite with id ${spriteId} not found`);
    return;
  }

  for (const block of scripts) {
    // Update the sprite reference with the latest state
    currentSprite = await executeBlock(block, currentSprite, store);
    checkCollisions();
  }
};
