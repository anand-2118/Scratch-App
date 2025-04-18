
import { useState, useEffect, useRef } from 'react';
import { SpriteType } from '@/types';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

interface SpriteProps {
  sprite: SpriteType;
  selected: boolean;
  onClick: () => void;
}

export const Sprite = ({ sprite, selected, onClick }: SpriteProps) => {
  const spriteRef = useRef<HTMLDivElement>(null);
  const { position, angle, width, height, messages } = sprite;
  
  // Handle sprite click
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };
  
  // Message bubble styles
  const getBubbleStyle = (type: 'say' | 'think') => {
    const common = "absolute max-w-[150px] bg-white p-2 rounded-lg border border-gray-300 text-sm";
    
    if (type === 'say') {
      return cn(common, "rounded-bl-none");
    } else {
      return cn(common, "rounded-bl-none");
    }
  };

  return (
    <div 
      ref={spriteRef}
      className={cn(
        "absolute cursor-pointer transition-transform",
        selected && "outline outline-2 outline-blue-500"
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'center',
      }}
      onClick={handleClick}
    >
      <img 
        src={sprite.image} 
        alt={sprite.name}
        className="w-full h-full object-contain"
      />
      
      {/* Message bubbles */}
      {messages.map((msg, index) => (
        msg.visible && (
          <div 
            key={index} 
            className={getBubbleStyle(msg.type)}
            style={{
              top: `-${msg.text.length > 20 ? 60 : 40}px`,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {msg.text}
            {/* Add think bubble dots if needed */}
            {msg.type === 'think' && (
              <div className="absolute -bottom-3 left-5 flex">
                <div className="w-2 h-2 bg-white rounded-full border border-gray-300"></div>
                <div className="w-1 h-1 ml-1 bg-white rounded-full border border-gray-300"></div>
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};
