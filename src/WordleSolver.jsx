import React, { useState } from "react";
import words from "./words";

const WordleSolver = () => {
  const [green, setGreen] = useState(["", "", "", "", ""]);
  const [yellow, setYellow] = useState([""]);
  const [grey, setGrey] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [useCustomBank, setUseCustomBank] = useState(false);
  const [suggestions, setSuggestions] = useState({ full: [], custom: [] });

  const handleGreenChange = (index, value) => {
    const newGreen = [...green];
    newGreen[index] = value.toUpperCase();
    setGreen(newGreen);
  };

  const handleYellowChange = (index, value) => {
    const newYellow = [...yellow];
    newYellow[index] = value.toUpperCase();
    setYellow(newYellow);
  };

  const addYellowRow = () => {
    setYellow([...yellow, ""]);
  };

  const clearAll = () => {
    setGreen(["", "", "", "", ""]);
    setYellow([""]);
    setGrey("");
    setSuggestions({ full: [], custom: [] });
  };

  const updateSuggestions = () => {
    const dict = words;

    const filterWords = (wordList) =>
      wordList.filter((word) => {
        for (let i = 0; i < 5; i++) {
          if (green[i] && word[i] !== green[i]) return false;
        }
        for (let y of yellow) {
          if (y) {
            if (!word.includes(y)) return false;
            for (let i = 0; i < 5; i++) {
              if (green[i] !== y && word[i] === y) return false;
            }
          }
        }
        for (let g of grey.toUpperCase()) {
          if (word.includes(g)) return false;
        }
        return true;
      });

    const fullSuggestions = filterWords(dict);

    let customSuggestions = [];
    if (useCustomBank && customWords.trim()) {
      const customList = customWords
        .split(/[\s,]+/)
        .map((w) => w.trim().toUpperCase())
        .filter((w) => w.length === 5);
      customSuggestions = filterWords(customList);
    }

    setSuggestions({
      full: fullSuggestions,
      custom: customSuggestions,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Wordle Solver</h1>

      {/* Green row */}
      <div className="mb-4">
        <p className="font-semibold">Green Letters (Correct):</p>
        <div className="flex gap-2">
          {green.map((g, i) => (
            <input
              key={i}
              value={g}
              onChange={(e) => handleGreenChange(i, e.target.value.slice(-1))}
              maxLength={1}
              className="w-12 h-12 text-center border-2 rounded bg-green-100 border-green-400 text-xl uppercase"
            />
          ))}
        </div>
      </div>

      {/* Yellow row */}
      <div className="mb-4">
        <p className="font-semibold">Yellow Letters (Wrong Spot):</p>
        {yellow.map((y, i) => (
          <input
            key={i}
            value={y}
            onChange={(e) => handleYellowChange(i, e.target.value.slice(-1))}
            maxLength={1}
            className="w-12 h-12 text-center border-2 rounded bg-yellow-100 border-yellow-400 text-xl uppercase mr-2"
          />
        ))}
        <button
          onClick={addYellowRow}
          className="ml-2 px-3 py-1 bg-yellow-300 rounded shadow hover:bg-yellow-400"
        >
          + Add
        </button>
      </div>

      {/* Grey row */}
      <div className="mb-4">
        <p className="font-semibold">Grey Letters (Not in Word):</p>
        <input
          value={grey}
          onChange={(e) => setGrey(e.target.value.toUpperCase())}
          className="w-full p-2 border-2 rounded bg-gray-100 border-gray-400 uppercase"
          placeholder="Enter letters not in the word..."
        />
      </div>

      {/* Custom Word Bank */}
      <div className="mb-4">
        <label className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            checked={useCustomBank}
            onChange={(e) => setUseCustomBank(e.target.checked)}
          />
          Enable Custom Word Bank
        </label>
        <textarea
          value={customWords}
          onChange={(e) => setCustomWords(e.target.value)}
          className="w-full p-2 border-2 rounded bg-blue-100 border-blue-400 h-24"
          placeholder="Enter custom 5-letter words separated by spaces or commas..."
        />
      </div>

      {/* Actions */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={updateSuggestions}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          Update
        </button>
        <button
          onClick={clearAll}
          className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
        >
          Clear All
        </button>
      </div>

      {/* Suggestions */}
      <div>
        <p className="font-semibold">Custom Dictionary Suggestions:</p>
        <p className="mb-4">{suggestions.custom.join(", ") || "None"}</p>

        <p className="font-semibold">Full Dictionary Suggestions:</p>
        <p>{suggestions.full.join(", ") || "None"}</p>
      </div>
    </div>
  );
};

export default WordleSolver;
