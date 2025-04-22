import { useState } from "react";
import { useAppStore } from "@/store";
import { useAnimationExecution } from "@/hooks/useAnimationExecution";
import { Button } from "@/components/ui/button";
import { Play, Square, RefreshCw } from "lucide-react";

export const PlayControls = () => {
  const [isExecuting, setIsExecuting] = useState(false);

  const sprites = useAppStore((state) => state.sprites);
  const isPlaying = useAppStore((state) => state.isPlaying);
  const setPlaying = useAppStore((state) => state.setPlaying);
  const updateSpritePosition = useAppStore(
    (state) => state.updateSpritePosition
  );
  const updateSpriteAngle = useAppStore((state) => state.updateSpriteAngle);
  const { executeScripts } = useAnimationExecution();

  // Execute scripts for all sprites
  const handlePlay = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setPlaying(true);

    try {
      // Execute scripts for each sprite in parallel
      await Promise.all(
        sprites.map((sprite) => executeScripts(sprite.id, sprite.scripts))
      );
    } catch (err) {
      console.error("Error executing scripts:", err);
    } finally {
      setIsExecuting(false);
      setPlaying(false);
    }
  };

  // Stop execution
  const handleStop = () => {
    setPlaying(false);
    setIsExecuting(false);
  };

  // Reset positions
  const handleReset = () => {
    // Reset all sprites to their starting positions
    sprites.forEach((sprite) => {
      updateSpritePosition(sprite.id, { x: 0, y: 0 });
      updateSpriteAngle(sprite.id, 0);
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handlePlay}
        disabled={isPlaying || sprites.length === 0}
        className="bg-green-500 hover:bg-green-600"
      >
        <Play className="w-4 h-4 mr-1" />
        Play
      </Button>

      <Button
        onClick={handleStop}
        disabled={!isPlaying}
        className="bg-red-500 hover:bg-red-600"
      >
        <Square className="w-4 h-4 mr-1" />
        Stop
      </Button>

      <Button
        onClick={handleReset}
        disabled={isPlaying}
        className="bg-blue-500 hover:bg-blue-600"
      >
        <RefreshCw className="w-4 h-4 mr-1" />
        Reset
      </Button>
    </div>
  );
};
