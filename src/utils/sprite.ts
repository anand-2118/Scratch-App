import { SpriteType, Position } from '@/types';

export const calculateMove = (sprite: SpriteType, steps: number): Position => {
  const angleInRadians = (sprite.angle - 90) * (Math.PI / 180);
  
  return {
    x: sprite.position.x + steps * Math.cos(angleInRadians),
    y: sprite.position.y + steps * Math.sin(angleInRadians)
  };
};


export const checkSpriteCollision = (sprite1: SpriteType, sprite2: SpriteType): boolean => {
  const dx = Math.abs(sprite1.position.x - sprite2.position.x);
  const dy = Math.abs(sprite1.position.y - sprite2.position.y);
  
  const combinedWidth = (sprite1.width + sprite2.width) / 2;
  const combinedHeight = (sprite1.height + sprite2.height) / 2;
  
  return dx < combinedWidth && dy < combinedHeight;
};


export const getRandomPosition = (
  stageWidth: number, 
  stageHeight: number, 
  spriteSize: number
): Position => {
  const padding = spriteSize / 2;
  
  return {
    x: Math.random() * (stageWidth - padding * 2) + padding,
    y: Math.random() * (stageHeight - padding * 2) + padding
  };
};


export const keepSpriteInBounds = (
  position: Position, 
  spriteSize: number, 
  stageWidth: number, 
  stageHeight: number
): Position => {
  const halfSize = spriteSize / 2;
  
  return {
    x: Math.max(halfSize, Math.min(position.x, stageWidth - halfSize)),
    y: Math.max(halfSize, Math.min(position.y, stageHeight - halfSize))
  };
};
