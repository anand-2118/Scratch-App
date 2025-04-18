import { useRef, useState, useEffect } from "react";
import { Sprite } from "./Sprite";
import { useAppStore } from "@/store";
import { Position } from "@/types";

export const Stage = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const sprites = useAppStore((state) => state.sprites);
  const selectedSpriteId = useAppStore((state) => state.selectedSpriteId);
  const selectSprite = useAppStore((state) => state.selectSprite);
  const updateSpritePosition = useAppStore(
    (state) => state.updateSpritePosition
  );
  const isPlaying = useAppStore((state) => state.isPlaying);
  const checkCollisions = useAppStore((state) => state.checkCollisions);

  // For dragging sprites
  const [draggedSpriteId, setDraggedSpriteId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });

  // Handle stage click (deselect sprites)
  const handleStageClick = () => {
    if (selectedSpriteId) {
      selectSprite("");
    }
  };

  // Handle sprite click
  const handleSpriteClick = (id: string) => {
    selectSprite(id);
  };

  // Set up mouse move handler for dragging sprites
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedSpriteId || isPlaying) return;

      if (stageRef.current) {
        const stageRect = stageRef.current.getBoundingClientRect();
        const x = e.clientX - stageRect.left - dragOffset.x;
        const y = e.clientY - stageRect.top - dragOffset.y;

        updateSpritePosition(draggedSpriteId, { x, y });
      }
    };

    const handleMouseUp = () => {
      setDraggedSpriteId(null);
    };

    if (draggedSpriteId) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedSpriteId, dragOffset, isPlaying, updateSpritePosition]);

  // Check for collisions while playing
  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      checkCollisions();
    }, 500); // Check for collisions every 500ms

    return () => clearInterval(intervalId);
  }, [isPlaying, checkCollisions]);

  // Handle sprite mouse down (for dragging)
  const handleSpriteMouseDown = (id: string, e: React.MouseEvent) => {
    if (isPlaying) return;

    // Find the sprite
    const sprite = sprites.find((s) => s.id === id);
    if (!sprite) return;

    // Calculate offset
    if (stageRef.current) {
      const stageRect = stageRef.current.getBoundingClientRect();
      const offsetX = e.clientX - stageRect.left - sprite.position.x;
      const offsetY = e.clientY - stageRect.top - sprite.position.y;

      setDragOffset({ x: offsetX, y: offsetY });
      setDraggedSpriteId(id);
    }
  };

  return (
    <div
      ref={stageRef}
      className="bg-white rounded-lg shadow-md overflow-hidden relative"
      style={{ height: "500px" }}
      onClick={handleStageClick}
    >
      {/* Stage background */}
      <div className="absolute inset-0 bg-gray-100"></div>

      {/* Sprites */}
      {sprites.map((sprite) => (
        <div
          key={sprite.id}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSpriteMouseDown(sprite.id, e);
            handleSpriteClick(sprite.id);
          }}
        >
          <Sprite
            sprite={sprite}
            selected={selectedSpriteId === sprite.id}
            onClick={() => handleSpriteClick(sprite.id)}
          />
        </div>
      ))}

      {/* Coordinates display */}
      <div className="absolute bottom-2 left-2 text-xs bg-white bg-opacity-70 p-1 rounded">
        {selectedSpriteId && (
          <>
            X:{" "}
            {sprites
              .find((s) => s.id === selectedSpriteId)
              ?.position.x.toFixed(0)}
            , Y:{" "}
            {sprites
              .find((s) => s.id === selectedSpriteId)
              ?.position.y.toFixed(0)}
          </>
        )}
      </div>
    </div>
  );
};
