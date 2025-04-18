
import { useState } from 'react';
import { useAppStore } from '@/store';
import { BlockItem } from './BlockItem';
import { nanoid } from 'nanoid';
import { BlockType } from '@/types';
import { CodeArea } from './CodeArea';

export const ScriptArea = () => {
  const selectedSpriteId = useAppStore(state => state.selectedSpriteId);
  const sprites = useAppStore(state => state.sprites);
  const removeBlockFromSprite = useAppStore(state => state.removeBlockFromSprite);
  const addBlockToSprite = useAppStore(state => state.addBlockToSprite);
  
  // Get the selected sprite
  const selectedSprite = sprites.find(sprite => sprite.id === selectedSpriteId);
  
  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!selectedSpriteId) return;
    
    try {
      const blockData = e.dataTransfer.getData('application/json');
      if (blockData) {
        const newBlock: BlockType = JSON.parse(blockData);
        addBlockToSprite(selectedSpriteId, newBlock);
      }
    } catch (err) {
      console.error('Error adding block:', err);
    }
  };
  
  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  // Handle removing a block
  const handleRemoveBlock = (blockId: string) => {
    if (selectedSpriteId) {
      removeBlockFromSprite(selectedSpriteId, blockId);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="p-2 bg-gray-100 border-b flex items-center justify-between">
        <h3 className="font-medium text-gray-700">Scripts</h3>
        {selectedSprite && (
          <span className="text-sm text-gray-500">
            For: {selectedSprite.name}
          </span>
        )}
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        {selectedSprite ? (
          selectedSprite.scripts.length > 0 ? (
            <div className="space-y-1">
              {selectedSprite.scripts.map(block => (
                <div key={block.id} className="relative">
                  <BlockItem 
                    block={block} 
                    onRemove={() => handleRemoveBlock(block.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-sm">
                Drag blocks here to build a script
              </p>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              Select a sprite first
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
