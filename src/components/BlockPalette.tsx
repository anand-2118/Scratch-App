
import { useState } from 'react';
import { BlockType, BlockCategory } from '@/types';
import { useAppStore } from '@/store';
import { BlockItem } from './BlockItem';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

export const BlockPalette = () => {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>('motion');
  const blockDefinitions = useAppStore(state => state.blockDefinitions);
  const selectedSpriteId = useAppStore(state => state.selectedSpriteId);
  const addBlockToSprite = useAppStore(state => state.addBlockToSprite);
  
  const categories: { id: BlockCategory, label: string }[] = [
    { id: 'motion', label: 'Motion' },
    { id: 'looks', label: 'Looks' },
    { id: 'control', label: 'Control' }
  ];
  
  const handleDragStart = (e: React.DragEvent, blockType: string) => {
    // Get the block definition
    const blockDef = blockDefinitions[blockType];
    
    // Create a new block with default params
    const defaultParams: Record<string, any> = {};
    if (blockDef.paramFields) {
      blockDef.paramFields.forEach(field => {
        defaultParams[field.name] = field.default;
      });
    }
    
    const newBlock: BlockType = {
      id: nanoid(),
      type: blockType,
      category: blockDef.category,
      params: defaultParams,
      ...(blockDef.hasChildren ? { children: [] } : {})
    };
    
    // Set drag data
    e.dataTransfer.setData('application/json', JSON.stringify(newBlock));
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  const getBlocksByCategory = (category: BlockCategory) => {
    return Object.entries(blockDefinitions)
      .filter(([_, def]) => def.category === category)
      .map(([key, def]) => ({
        type: key,
        ...def,
      }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="flex border-b">
        {categories.map(category => (
          <button
            key={category.id}
            className={cn(
              "px-4 py-2 text-sm font-medium flex-1",
              activeCategory === category.id ? 
                "bg-blue-500 text-white" : 
                "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {getBlocksByCategory(activeCategory).map((blockDef) => (
          <div 
            key={blockDef.type}
            draggable
            onDragStart={(e) => handleDragStart(e, blockDef.type)}
            className="mb-2"
          >
            <BlockItem 
              block={{
                id: `template-${blockDef.type}`,
                type: blockDef.type,
                category: blockDef.category as BlockCategory,
                params: blockDef.paramFields ? 
                  Object.fromEntries(
                    blockDef.paramFields.map(field => [field.name, field.default])
                  ) : 
                  {},
              }}
              isTemplate={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
