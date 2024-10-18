import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sheep from './components/Sheep';
import Fence from './components/Fence';
import Ground from './components/Ground';
import Physics from './Physics';
import * as ScreenOrientation from 'expo-screen-orientation';

const SheepJumpGame = ({ route }) => {
  const { sleepData } = route.params || { sleepData: { totalHours: 0 } };
  const [reviveTokens, setReviveTokens] = useState(sleepData.totalHours || 3);
  const [revivesUsed, setRevivesUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const gameEngineRef = useRef(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Lock orientation to landscape
  useEffect(() => {
    async function lockToLandscape() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    }
    lockToLandscape();

    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); // Revert to portrait
    };
  }, []);

  // Load the high score from AsyncStorage when the game starts
  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('highScore');
        if (storedHighScore !== null) {
          setHighScore(parseInt(storedHighScore, 10));
        }
      } catch (error) {
        console.error('Error loading high score:', error);
      }
    };
    loadHighScore();
  }, []);

  // Save the high score in AsyncStorage if the current score is higher
  const saveHighScore = async (newHighScore) => {
    try {
      await AsyncStorage.setItem('highScore', newHighScore.toString());
      setHighScore(newHighScore); // Update high score state
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  };

  // Setup the world entities and physics
  const setupWorld = () => {
    let engine = Matter.Engine.create({ enableSleeping: false });
    let world = engine.world;

    world.gravity.y = 1.7;

    const groundHeight = 100;
    const groundYPosition = windowHeight - groundHeight / 2;

    let ground = Matter.Bodies.rectangle(
      windowWidth / 2,
      groundYPosition,
      windowWidth,
      groundHeight,
      { isStatic: true, label: 'Ground' }
    );
    Matter.World.add(world, ground);

    let sheep = Matter.Bodies.rectangle(
      windowWidth / 4,
      groundYPosition - groundHeight / 2 - 25,
      50, // Width of the sheep
      50,
      { label: 'Sheep', frictionAir: 0.0 }
    );
    Matter.World.add(world, sheep);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('Sheep') && labels.includes('Fence')) {
          gameEngineRef.current.dispatch({ type: 'game-over' });
        }
        if (labels.includes('Sheep') && labels.includes('Ground')) {
          gameEngineRef.current.dispatch({ type: 'reset-jump' });
        }
      });
    });

    return {
      physics: { engine, world, windowWidth, windowHeight },
      sheep: { body: sheep, size: [50, 50], color: 'white', renderer: Sheep },
      ground: { body: ground, size: [windowWidth, groundHeight], color: 'green', renderer: Ground },
    };
  };

  const [entities, setEntities] = useState({});

  useEffect(() => {
    const newEntities = setupWorld();
    setEntities(newEntities);
    if (gameEngineRef.current) {
      gameEngineRef.current.swap(newEntities);
    }
  }, [windowWidth, windowHeight]);

  const resetField = () => {
    setEntities((prevEntities) => {
      const newEntities = { ...prevEntities };
      Object.keys(newEntities).forEach((key) => {
        if (key.startsWith('fence') || key.startsWith('pillow') || key.startsWith('shear')) {
          Matter.World.remove(newEntities.physics.world, newEntities[key].body);
          delete newEntities[key];
        }
      });
      return newEntities;
    });
  };

  const onEvent = (e) => {
    if (e.type === 'game-over') {
      if (reviveTokens >= 0) {
        // Revive the player
        setIsPaused(true);

        // Reset sheep position
        Matter.Body.setPosition(entities.sheep.body, {
          x: windowWidth / 4,
          y:
            entities.ground.body.position.y -
            entities.ground.size[1] / 2 -
            entities.sheep.size[1] / 2,
        });
        Matter.Body.setVelocity(entities.sheep.body, { x: 0, y: 0 });

        // Reset jumpCount when reviving
        entities.physics.jumpCount = 0;

        // Reset the field (remove fences, pillows, shears)
        resetField();

        // Pause and then resume after a short delay
        setTimeout(() => {
          setIsPaused(false);
        }, 1000);

        // Decrease reviveTokens if greater than 0
        if (reviveTokens > 0) {
          setReviveTokens(reviveTokens - 1);
        } else {
          // Set reviveTokens to -1 to indicate no more revives
          setReviveTokens(-1);
        }

        // Increase revivesUsed
        setRevivesUsed((prev) => prev + 1);
      } else {
        // Game Over, but keep the engine running (no gameEngineRef.stop())
        setIsGameOver(true);

        // Check if new high score should be saved
        if (score > highScore) {
          saveHighScore(score);
        }
      }
    } else if (e.type === 'score') {
      setScore((prevScore) => prevScore + 1);
    } else if (e.type === 'remove-entities') {
      const entitiesToRemove = e.entities;
      setEntities((prevEntities) => {
        const updatedEntities = { ...prevEntities };
        entitiesToRemove.forEach((key) => {
          delete updatedEntities[key];
        });
        return updatedEntities;
      });
    } else if (e.type === 'reset-jump') {
      entities.physics.jumpCount = 0;
    }
  };

  const resetGame = () => {
    setScore(0);
    setReviveTokens(sleepData.totalHours || 3);
    setRevivesUsed(0);
    setIsGameOver(false);
    setIsPaused(false);
    const newEntities = setupWorld();
    setEntities(newEntities);
    if (gameEngineRef.current) {
      gameEngineRef.current.swap(newEntities);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Top Bar (with heart icon for revives) */}
      <View style={styles.topBar}>
        <Text style={styles.topBarText}>{`Score: ${score}    Revives: ${
          reviveTokens >= 0 ? reviveTokens : 0
        } ❤️`}</Text>
      </View>

      {isGameOver && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.gameOverBox}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.finalScoreText}>{`Final Score: ${score}`}</Text>
              <Text style={styles.revivesUsedText}>{`Revives Used: ${revivesUsed}`}</Text>
              <Text style={styles.highScoreText}>{`High Score: ${highScore}`}</Text>
              <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
                <Text style={styles.resetButtonText}>Restart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.gameArea}>
        <GameEngine
          ref={gameEngineRef}
          systems={[Physics]}
          entities={entities}
          running={!isPaused} // Keep running even if the game is over
          onEvent={onEvent}
          style={styles.gameContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 5,
    borderRadius: 5,
  },
  topBarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#800080',
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    borderWidth: 5,
    borderColor: '#000',
    margin: 10,
    overflow: 'hidden',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#87CEEB', // Light blue background
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverBox: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 3,
    borderRadius: 10,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 24,
    marginBottom: 5,
  },
  revivesUsedText: {
    fontSize: 24,
    marginBottom: 5,
  },
  highScoreText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default SheepJumpGame;
