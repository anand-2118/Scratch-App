import { useAppStore } from "@/store";
import { nanoid } from "nanoid";
import { useEffect } from "react";

export const SpritePanel = () => {
  const sprites = useAppStore((state) => state.sprites);
  const selectedSpriteId = useAppStore((state) => state.selectedSpriteId);
  const selectSprite = useAppStore((state) => state.selectSprite);
  const addSprite = useAppStore((state) => state.addSprite);
  const removeSprite = useAppStore((state) => state.removeSprite);
  const updateSpritePosition = useAppStore(
    (state) => state.updateSpritePosition
  );

  // Set random positions for all sprites on first render
  useEffect(() => {
    sprites.forEach((sprite) => {
      const position = {
        x: Math.floor(Math.random() * 300) + 50,
        y: Math.floor(Math.random() * 300) + 50,
      };
      updateSpritePosition(sprite.id, position);
    });
  }, []); // Empty dependency array means this runs once on mount

  const handleAddSprite = () => {
    // Use cat image for all sprites
    const position = {
      x: Math.floor(Math.random() * 300) + 50,
      y: Math.floor(Math.random() * 300) + 50,
    };

    addSprite({
      name: `Cat${sprites.length + 1}`,
      image: "/cat.svg",
      position,
      width: 95,
      height: 100,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-2 bg-gray-100 border-b">
        <h3 className="font-medium text-gray-700">Sprites</h3>
      </div>

      <div className="p-3">
        <div className="flex flex-wrap gap-3">
          {sprites.map((sprite) => (
            <div
              key={sprite.id}
              className={`
                w-16 h-16 rounded border p-1 cursor-pointer
                ${
                  selectedSpriteId === sprite.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                }
              `}
              onClick={() => selectSprite(sprite.id)}
            >
              <div className="relative w-full h-full">
                <img
                  src={sprite.image}
                  alt={sprite.name}
                  className="object-contain w-full h-full"
                />
                <span className="absolute bottom-0 left-0 right-0 text-xs text-center truncate bg-white bg-opacity-70">
                  {sprite.name}
                </span>
              </div>
            </div>
          ))}

          <button
            className="w-16 h-16 rounded border border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50"
            onClick={handleAddSprite}
          >
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {selectedSpriteId && sprites.length > 1 && (
        <div className="p-3 pt-0">
          <button
            className="text-sm text-red-500 hover:text-red-700"
            onClick={() => removeSprite(selectedSpriteId)}
          >
            Delete Selected Sprite
          </button>
        </div>
      )}
    </div>
  );
};
