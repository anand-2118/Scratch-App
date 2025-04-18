
import { useAppStore } from '@/store';
import { BlockType } from '@/types';
import { nanoid } from 'nanoid';
import { BlockItem } from './BlockItem';

interface CodeAreaProps {
  spriteId: string;
}

export const CodeArea = ({ spriteId }: CodeAreaProps) => {
  const sprites = useAppStore(state => state.sprites);
  const addBlockToSprite = useAppStore(state => state.addBlockToSprite);
  const removeBlockFromSprite = useAppStore(state => state.removeBlockFromSprite);
  
  const sprite = sprites.find(s => s.id === spriteId);
  
  if (!sprite) return null;
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const blockData = e.dataTransfer.getData('application/json');
      if (blockData) {
        const droppedBlock: BlockType = JSON.parse(blockData);
        
        // Generate a new unique ID for the block to prevent duplicates
        const newBlock: BlockType = {
          ...droppedBlock,
          id: nanoid()
        };
        
        addBlockToSprite(spriteId, newBlock);
      }
    } catch (err) {
      console.error('Error adding block:', err);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  return (
    <div 
      className="p-3 bg-gray-100 rounded-md min-h-[200px]"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3 className="font-medium mb-2">Code for {sprite.name}</h3>
      
      <div className="space-y-2">
        {sprite.scripts.map(block => (
          <div key={block.id} className="mb-2">
            <BlockItem 
              block={block} 
              onRemove={() => removeBlockFromSprite(spriteId, block.id)} 
            />
          </div>
        ))}
        
        {sprite.scripts.length === 0 && (
          <div className="flex items-center justify-center h-24 border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-400">Drag blocks here</p>
          </div>
        )}
      </div>
    </div>
  );
};
