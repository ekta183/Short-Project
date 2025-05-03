import React, { useState, useEffect } from "react";

const MemoryGame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [won, setWon] = useState(false);

  const [startGame, setStartGame] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState(() => {
    const stored = localStorage.getItem("bestTime");
    return stored ? Number(stored) : null;
  });

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairCount = Math.floor(totalCards / 2);
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setStartGame(false);
    setElapsedTime(0);
    setStartTime(null);
    setEndTime(null);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won || !startGame) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      const finishedAt = Date.now();
      setWon(true);
      setEndTime(finishedAt);

      const timeTaken = Math.floor((finishedAt - startTime) / 1000);
      if (bestTime === null || timeTaken < bestTime) {
        setBestTime(timeTaken);
        localStorage.setItem("bestTime", timeTaken);
      }
    }
  }, [solved, cards]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (startGame && !won) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [startGame, startTime, won]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-400 p-4 ">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>

      <div className="mb-4">
        <label htmlFor="gridSize" className="mr-2">
          Grid Size(max 10) :
        </label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={handleGridSizeChange}
          className="border-2 border-black rounded px-2 py-1"
        />
      </div>

      <button
        onClick={() => {
          setStartGame(true);
          setStartTime(Date.now());
          setEndTime(null);
          setElapsedTime(0);
        }}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        Start Game
      </button>

      {startGame && !won && (
        <div className="mt-2 text-lg text-gray-700">
          Time: {elapsedTime} seconds
        </div>
      )}

      <div
        className={`grid gap-2 mb-4 mt-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {startGame &&
          cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-400"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          ))}
      </div>

      {won && (
        <>
          <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">
            You Won!
          </div>
          <div className="mt-2 text-lg text-gray-700 text-white">
            Time Taken: {Math.floor((endTime - startTime) / 1000)} seconds
            <br />
            Best Time: {bestTime !== null ? `${bestTime} seconds` : "N/A"}
          </div>
        </>
      )}

      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default MemoryGame;
