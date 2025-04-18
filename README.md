# Scratch-like Visual Code Editor

## Project Overview

This project is a visual code editor similar to MIT's Scratch, built with React and TypeScript. It allows users to create animations and interactive programs by dragging and dropping code blocks.

## Features

1. **Motion Animations**
   - Move steps
   - Turn degrees
   - Go to x,y coordinates
   - Repeat animations (control blocks)

2. **Looks Animations**
   - Say text for a specified duration
   - Think text for a specified duration

3. **Multiple Sprites Support**
   - Create multiple characters/sprites
   - Each sprite has its own scripts
   - Play all animations simultaneously

4. **Hero Feature: Collision-Based Animation Swap**
   - When two sprites collide, their animation scripts are swapped
   - This creates dynamic interactions between sprites

## How to Use

1. **Adding Sprites**
   - Click the "+" button in the Sprites panel to add a new sprite
   - Select a sprite to edit its scripts

2. **Creating Programs**
   - Drag blocks from the Block Palette to the Script Area
   - Configure block parameters by changing the values
   - Arrange blocks in sequence

3. **Running Programs**
   - Click the "Play" button to execute all sprite scripts
   - Watch the animations on the stage
   - Observe how sprites interact when they collide

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Beautiful DND for drag and drop functionality

## Project Structure

- `src/components`: UI components for the editor
- `src/store`: Global state management
- `src/types`: TypeScript type definitions
- `src/utils`: Helper functions for animations and sprite movement

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Credits

This project is a Scratch-inspired editor built for demonstration purposes.
