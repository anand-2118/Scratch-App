
import { BlockType } from '@/types';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface BlockItemProps {
  block: BlockType;
  isTemplate?: boolean;
  onRemove?: () => void;
}

export const BlockItem = ({ block, isTemplate = false, onRemove }: BlockItemProps) => {
  const blockDefinitions = useAppStore(state => state.blockDefinitions);
  const selectedSpriteId = useAppStore(state => state.selectedSpriteId);
  const updateBlockParams = useAppStore(state => state.updateBlockParams);
  
  const blockDef = blockDefinitions[block.type];
  if (!blockDef) return null;
  
  const getBlockColorByCategory = (category: string) => {
    switch (category) {
      case 'motion':
        return 'bg-blue-400 hover:bg-blue-500';
      case 'looks':
        return 'bg-purple-400 hover:bg-purple-500';
      case 'control':
        return 'bg-yellow-400 hover:bg-yellow-500';
      default:
        return 'bg-gray-400 hover:bg-gray-500';
    }
  };
  
  const handleParamChange = (paramName: string, value: any) => {
    if (!isTemplate && selectedSpriteId) {
      console.log("Parameter change:", paramName, value);
      updateBlockParams(selectedSpriteId, block.id, { [paramName]: value });
    }
  };
  
  // Replace parameter placeholders in the label with input fields
  const renderLabel = () => {
    if (!blockDef.paramFields) return blockDef.label;
    
    let label = blockDef.label;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Find the underscores that represent parameter placeholders
    const placeholderRegex = /_{2,}/g;
    let match;
    let paramIndex = 0;
    
    while ((match = placeholderRegex.exec(label)) !== null) {
      // Add the text before the placeholder
      parts.push(label.substring(lastIndex, match.index));
      
      // Get the parameter field
      const paramField = blockDef.paramFields[paramIndex];
      
      if (paramField) {
        // Get the current value from the block's params, or use default
        const paramValue = block.params && block.params[paramField.name] !== undefined 
          ? block.params[paramField.name] 
          : paramField.default;
        
        // Add an input for the parameter
        parts.push(
          <input
            key={`${block.id}-${paramField.name}`}
            type={paramField.type === 'number' ? 'number' : 'text'}
            value={paramValue}
            onChange={(e) => {
              const value = paramField.type === 'number' 
                ? parseFloat(e.target.value) || 0 
                : e.target.value;
              handleParamChange(paramField.name, value);
            }}
            className="w-16 px-1 text-center bg-white text-black font-bold rounded border border-gray-400 mx-1"
            style={{ color: 'black', fontWeight: 'bold' }}
            disabled={isTemplate}
            // Important: Stop event propagation to prevent dragging issues
            onClick={(e) => e.stopPropagation()}
            // Important: Don't lose focus on input click
            onFocus={(e) => e.stopPropagation()}
          />
        );
        
        paramIndex++;
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add the remaining text
    parts.push(label.substring(lastIndex));
    
    return parts;
  };
  
  return (
    <div
      className={cn(
        "p-2 rounded-md text-white font-medium flex items-center justify-between cursor-grab relative mb-2",
        getBlockColorByCategory(block.category)
      )}
      draggable={!isTemplate}
    >
      <div className="flex-1 flex items-center">
        {renderLabel()}
      </div>
      
      {!isTemplate && onRemove && (
        <button
          className="ml-2 text-white hover:text-red-200"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
