import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, Modal } from 'react-native';

// List of possible 5-letter words (you can expand this list)
const WORDS = ["sheep", "dream", "night", "herds", "sleep", "cloud"];

/**
 * Herdle component - A Wordle-like word guessing game
 * Number of attempts is based on user's sleep data
 * 
 * @param {Object} route - Contains navigation route params
 * @param {Object} navigation - Navigation object for screen transitions
 */
const Herdle = ({ route, navigation }) => {
  const { sleepData } = route.params || { sleepData: { totalHours: 8 } };
  
  /**
   * Calculates maximum attempts based on hours of sleep
   * Formula: (sleep hours / 2) + 2, capped between 1 and 6 attempts
   * 
   * @param {number} sleepHours - Hours of sleep from previous night
   * @returns {number} Number of allowed attempts
   */
  const calculateAttempts = (sleepHours) => Math.max(1, Math.min(Math.floor(sleepHours / 2) + 2, 6));
  const maxAttempts = calculateAttempts(sleepData.totalHours);
  
  const [word, setWord] = useState('');
  const [guesses, setGuesses] = useState(Array(maxAttempts).fill('')); // Pre-fill guesses based on attempts
  const [currentGuess, setCurrentGuess] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(maxAttempts);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false); // State for showing instructions modal

  /**
   * Initializes game by selecting random word from WORDS array
   * Runs once when component mounts
   */
  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(randomWord);
  }, []);

  /**
   * Processes player's guess attempt
   * - Validates guess length
   * - Updates guesses array
   * - Checks for win/loss conditions
   * - Updates game state accordingly
   */
  const checkGuess = () => {
    if (currentGuess.length !== 5) {
      Alert.alert("Invalid Guess", "Guess must be a 5-letter word.");
      return;
    }

    const formattedGuess = currentGuess.toLowerCase();
    const newGuesses = [...guesses];
    newGuesses[maxAttempts - attemptsLeft] = formattedGuess;
    setGuesses(newGuesses);

    // Check if the guess is correct
    if (formattedGuess === word) {
      setWin(true);
      setGameOver(true);
    } else if (attemptsLeft - 1 === 0) {
      setGameOver(true); // Player used up all attempts
    }

    setAttemptsLeft(attemptsLeft - 1);
    setCurrentGuess('');
  };

  /**
   * Determines feedback color for each letter in guess
   * - Green: Correct letter in correct position
   * - Yellow: Correct letter in wrong position
   * - Gray: Letter not in word
   * 
   * @param {string} letter - The guessed letter
   * @param {number} index - Position of letter in word
   * @returns {Object} Style object for letter feedback
   */
  const getLetterFeedback = (letter, index) => {
    if (word[index] === letter) return styles.correctLetter; // Green for correct position
    if (word.includes(letter)) return styles.presentLetter; // Yellow for wrong position
    return styles.absentLetter; // Gray for incorrect
  };

  /**
   * Handles game completion
   * Shows alert and navigates back to previous screen
   * Used when player wins, loses, or wants to exit
   */
  const handlePlayAgain = () => {
    Alert.alert("No More Plays", "You have used up your play. Come back after more sleep!");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      {/* Question mark icon in the upper right-hand corner */}
      <TouchableOpacity style={styles.infoIcon} onPress={() => setShowInstructions(true)}>
        <Text style={styles.infoText}>?</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Herdle</Text>
      <Text style={styles.subtitle}>
        Guess the 5-letter word! You have {attemptsLeft} attempts left this game.
      </Text>

      <View style={styles.guessesContainer}>
        {guesses.map((guess, guessIndex) => (
          <View key={guessIndex} style={styles.guessRow}>
            {guess.padEnd(5).split('').map((letter, letterIndex) => (
              <View
                key={letterIndex}
                style={[styles.letterBox, guess && getLetterFeedback(letter, letterIndex)]}
              >
                <Text style={styles.letterText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      {!gameOver && (
        <>
          <TextInput
            style={styles.input}
            value={currentGuess}
            onChangeText={setCurrentGuess}
            maxLength={5}
            placeholder="Enter a 5-letter word"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.checkButton} onPress={checkGuess}>
            <Text style={styles.checkButtonText}>Submit Guess</Text>
          </TouchableOpacity>
        </>
      )}

      {gameOver && (
        <View style={styles.gameOverContainer}>
          {win ? (
            <Text style={styles.resultText}>Congratulations! You guessed the word "{word}"</Text>
          ) : (
            <Text style={styles.resultText}>Game Over! The word was "{word}".</Text>
          )}

          <TouchableOpacity style={styles.resetButton} onPress={handlePlayAgain}>
            <Text style={styles.resetButtonText}>Close Game</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Instructions modal */}
      <Modal visible={showInstructions} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>How to Play Herdle</Text>
            <Text style={styles.modalText}>
              {"\u2022"} Guess the 5-letter word in up to six tries. {"\n"}
              {"\u2022"} <Text style={styles.correctLetterText}>Green</Text> means the letter is in the correct spot. {"\n"}
              {"\u2022"} <Text style={styles.presentLetterText}>Yellow</Text> means the letter is in the word but in the wrong spot. {"\n"}
              {"\u2022"} <Text style={styles.absentLetterText}>Gray</Text> means the letter is not in the word. {"\n"}
              {"\u2022"} You can earn up to 6 attempts by getting at least 8 hours of sleep the night before!
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  infoIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 15,
  },
  infoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#28353B',
    marginBottom: 20,
    textAlign: 'center',
  },
  guessesContainer: {
    width: '100%',
    marginBottom: 30,
  },
  guessRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  letterBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#aaa',
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  correctLetter: {
    backgroundColor: '#6BCB77', // Green
    borderColor: '#6BCB77',
  },
  presentLetter: {
    backgroundColor: '#FFD700', // Yellow
    borderColor: '#FFD700',
  },
  absentLetter: {
    backgroundColor: '#D3D3D3', // Gray
    borderColor: '#D3D3D3',
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#800080',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 20,
    marginBottom: 20,
    color: '#000',
  },
  checkButton: {
    backgroundColor: '#800080',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  gameOverContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#800080',
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#800080',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18, // Increased font size for better readability
    textAlign: 'left',
    marginBottom: 20,
  },
  correctLetterText: {
    color: '#6BCB77', // Green
    fontWeight: 'bold',
  },
  presentLetterText: {
    color: '#FFD700', // Yellow
    fontWeight: 'bold',
  },
  absentLetterText: {
    color: '#D3D3D3', // Gray
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#800080',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Herdle;
