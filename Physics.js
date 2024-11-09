import Matter from 'matter-js';
import Fence from './components/Fence';
import Pillow from './components/Pillow';
import Shear from './components/Shear';

let tick = 0;
let fenceId = 0;
let nextFenceTick = 1200; // Fixed interval for fence generation
let maxSpeedReached = 7; // Track the maximum speed reached

/**
 * Physics system for the sheep jumping game
 * Handles game mechanics including:
 * - Sheep movement and jumping
 * - Obstacle generation and movement
 * - Collision detection
 * - Speed management
 * - Score tracking
 * 
 * @param {Object} entities - Game entities including sheep, ground, fences, etc.
 * @param {Object} param1 - Game parameters including touches, time, and dispatch
 * @param {Array} param1.touches - Touch inputs from the player
 * @param {Object} param1.time - Time-related data including delta time
 * @param {Function} param1.dispatch - Function to dispatch game events
 * @returns {Object} Updated entities after physics calculations
 */
const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;
  let world = entities.physics.world;

  const windowWidth = entities.physics.windowWidth;
  const groundYPosition = entities.ground.body.position.y; // Use ground Y position as reference
  const screenHeight = entities.physics.windowHeight;

  // Cap delta time
  let delta = Math.min(time.delta, 12);

  // Initialize speed if not set
  if (!entities.physics.speed) {
    entities.physics.speed = 7; // Initial speed
  }

  // Gradually increase the speed every 5 seconds
  if (!entities.physics.speedIncreaseTick) {
    entities.physics.speedIncreaseTick = 0;
  }

  entities.physics.speedIncreaseTick += delta;

  // Gradual speed increase over time (every 5 seconds)
  if (entities.physics.speedIncreaseTick >= 5000) {
    entities.physics.speed += 0.5; // Increase speed incrementally
    maxSpeedReached = entities.physics.speed; // Track the highest speed
    entities.physics.speedIncreaseTick = 0; // Reset tick after speed increase
  }

  // Keep the sheep's x-position fixed
  const sheepXPosition = windowWidth / 4;
  Matter.Body.setPosition(entities.sheep.body, {
    x: sheepXPosition,
    y: entities.sheep.body.position.y,
  });

  // Initialize jumpCount if not already initialized
  if (!entities.physics.jumpCount) {
    entities.physics.jumpCount = 0;
  }

  /**
   * Handles sheep jumping mechanics
   * Allows double jump (up to 2 jumps before touching ground)
   * Triggered by touch input
   */
  let jump = touches.find((t) => t.type === 'press' || t.type === 'long-press');
  if (jump) {
    const sheep = entities.sheep.body;

    // Allow up to two jumps (double jump)
    if (entities.physics.jumpCount < 2) {
      Matter.Body.setVelocity(sheep, {
        x: 0,
        y: -9, // Adjust jump height as needed
      });
      entities.physics.jumpCount += 1;
    }
  }

  // Move fences, pillows, and shears and collect them to remove if necessary
  let entitiesToRemove = [];

  Object.keys(entities)
    .filter((key) => key.startsWith('fence') || key.startsWith('pillow') || key.startsWith('shear'))
    .forEach((key) => {
      const entity = entities[key];

      // Move entity (fence, pillow, or shear) towards the left using dynamic speed
      Matter.Body.translate(entity.body, { x: -entities.physics.speed, y: 0 });

      // Check if the sheep touches the pillow or shear
      const sheep = entities.sheep.body;
      const distance = Math.sqrt(
        Math.pow(sheep.position.x - entity.body.position.x, 2) +
        Math.pow(sheep.position.y - entity.body.position.y, 2)
      );

      if (distance < 50 && !entity.scored) {
        entity.scored = true;
        if (key.startsWith('pillow')) {
          dispatch({ type: 'slow-down' }); // Apply pillow effect (slow down)
          entities.physics.speed *= 0.85; // Reduce speed by 15%
          entitiesToRemove.push(key); // Remove pillow after being touched
        } else if (key.startsWith('shear')) {
          dispatch({ type: 'lose-life' }); // Apply shear effect (lose a life)
          entitiesToRemove.push(key); // Remove shear after being touched
        }
      }

      // Remove entity if it goes off-screen
      if (entity.body.position.x <= -50) {
        entitiesToRemove.push(key);
        Matter.World.remove(world, entity.body);
      }

      // Check if fence has passed the sheep to increment score
      if (!entity.scored && key.startsWith('fence') && entity.body.position.x < sheepXPosition) {
        entity.scored = true;
        dispatch({ type: 'score' });
      }
    });

  // Update tick and handle regular fence generation
  tick += delta;

  // Generate fences at regular intervals (every 1200ms, for example)
  if (tick >= nextFenceTick) {
    tick = 0;
    fenceId += 1;

    // Variable height for the fence
    const fenceWidth = 80; // Width of the entire fence group (4 posts)
    const fenceHeight = Math.floor(Math.random() * 50) + 80; // Variable fence height between 80 and 130

    // Ensure the fence is flush with the ground
    const fenceYPosition = groundYPosition - fenceHeight / 2;

    // Create a single fence object consisting of 4 posts, all connected to the ground
    let newFence = Matter.Bodies.rectangle(
      windowWidth + 50,
      fenceYPosition,
      fenceWidth,
      fenceHeight,
      { label: 'Fence', isStatic: true }
    );

    // Add the new fence to the world
    Matter.World.add(world, newFence);

    // Add the new fence to entities
    entities[`fence${fenceId}`] = {
      body: newFence,
      size: [fenceWidth, fenceHeight],
      renderer: Fence,
      scored: false,
    };

    // Randomly add a pillow (1/20 chance) or a shear (1/5 chance)
    const random = Math.random();

    // Add pillow (1/20 chance)
    if (random < 0.05) {
      const pillowYPosition = screenHeight * 0.6 - Math.random() * (screenHeight * 0.2); // Appear between 60%-80% of the screen height
      let newPillow = Matter.Bodies.circle(windowWidth + 50, pillowYPosition, 35, { label: 'Pillow', isStatic: true });

      Matter.World.add(world, newPillow);

      entities[`pillow${fenceId}`] = {
        body: newPillow,
        size: [50, 50], // Pillow size
        renderer: Pillow,
        scored: false,
      };
    }

    // Add shears (1/5 chance) at a higher position
    if (random >= 0.05 && random < 0.25) {
      const shearYPosition = screenHeight * 0.5 - Math.random() * (screenHeight * 0.2); // Appear slightly higher (40%-60% of the screen height)
      let newShear = Matter.Bodies.rectangle(windowWidth + 50, shearYPosition, 25, 50, { label: 'Shear', isStatic: true });

      Matter.World.add(world, newShear);

      entities[`shear${fenceId}`] = {
        body: newShear,
        size: [20, 40], // Shear size
        renderer: Shear,
        scored: false,
      };
    }
  }

  // Dispatch event to remove entities
  if (entitiesToRemove.length > 0) {
    dispatch({ type: 'remove-entities', entities: entitiesToRemove });
  }

  // Update the Matter.js engine
  Matter.Engine.update(engine, delta);

  return entities;
};

export default Physics;
