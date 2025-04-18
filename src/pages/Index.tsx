
import { Stage } from '@/components/Stage';
import { BlockPalette } from '@/components/BlockPalette';
import { ScriptArea } from '@/components/ScriptArea';
import { SpritePanel } from '@/components/SpritePanel';
import { PlayControls } from '@/components/PlayControls';
import ScratchLogo from '@/components/ScratchLogo';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
     
      <header className="bg-blue-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <ScratchLogo />
          <PlayControls />
        </div>
      </header>
      
      
      <main className="container mx-auto flex-1 p-4 flex flex-col gap-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <Stage />
          </div>
          <div className="md:col-span-1">
            <SpritePanel />
          </div>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80">
          <div className="h-full">
            <BlockPalette />
          </div>
          <div className="h-full">
            <ScriptArea />
          </div>
        </div>
      </main>
      
      
      <footer className="bg-gray-100 p-4 border-t">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          Scratch-like Editor - Built with React and TypeScript
        </div>
      </footer>
    </div>
  );
};

export default Index;
