import { SpriteType, Position } from "@/types";

// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 500;

// Calculate new position based on angle and steps
export const calculateMove = (sprite: SpriteType, steps: number): Position => {
  const angleInRadians = (sprite.angle - 90) * (Math.PI / 180);

  return {
    x: sprite.position.x + steps * Math.cos(angleInRadians),
    y: sprite.position.y + steps * Math.sin(angleInRadians),
  };
};

// Calculate vertical movement with boundary check
export const calculateVerticalMove = (
  sprite: SpriteType,
  steps: number
): Position => {
  const newY = sprite.position.y + steps;
  const spriteHeight = sprite.height;

  // Keep sprite within stage bounds, ensuring no part of the sprite goes outside
  const boundedY = Math.max(
    spriteHeight / 2,
    Math.min(newY, STAGE_HEIGHT - spriteHeight / 2)
  );

  return {
    x: sprite.position.x,
    y: boundedY,
  };
};

// Calculate horizontal movement with boundary check
export const calculateHorizontalMove = (
  sprite: SpriteType,
  steps: number
): Position => {
  const newX = sprite.position.x + steps;
  const spriteWidth = sprite.width;

  // Keep sprite within stage bounds, ensuring no part of the sprite goes outside
  const boundedX = Math.max(
    spriteWidth / 2,
    Math.min(newX, STAGE_WIDTH - spriteWidth / 2)
  );

  return {
    x: boundedX,
    y: sprite.position.y,
  };
};

// Check if two sprites are colliding using simple bounding box collision
export const checkSpriteCollision = (
  sprite1: SpriteType,
  sprite2: SpriteType
): boolean => {
  const dx = Math.abs(sprite1.position.x - sprite2.position.x);
  const dy = Math.abs(sprite1.position.y - sprite2.position.y);

  const combinedWidth = (sprite1.width + sprite2.width) / 2;
  const combinedHeight = (sprite1.height + sprite2.height) / 2;

  return dx < combinedWidth && dy < combinedHeight;
};

// Get a random position within the stage bounds
export const getRandomPosition = (
  spriteSize: number,
  stageWidth: number = STAGE_WIDTH,
  stageHeight: number = STAGE_HEIGHT
): Position => {
  const halfSize = spriteSize / 2;
  const maxX = stageWidth - halfSize;
  const maxY = stageHeight - halfSize;

  return {
    x: Math.random() * (maxX - halfSize) + halfSize,
    y: Math.random() * (maxY - halfSize) + halfSize,
  };
};

// Keep sprite within stage bounds
export const keepSpriteInBounds = (
  position: Position,
  spriteSize: number,
  stageWidth: number,
  stageHeight: number
): Position => {
  const halfSize = spriteSize / 2;

  return {
    x: Math.max(halfSize, Math.min(position.x, stageWidth - halfSize)),
    y: Math.max(halfSize, Math.min(position.y, stageHeight - halfSize)),
  };
};
