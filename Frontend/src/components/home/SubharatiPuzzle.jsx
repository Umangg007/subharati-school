import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCcw, Puzzle } from 'lucide-react';

const TARGET_WORD = "SUBHARATI";
const TARGET_ARRAY = TARGET_WORD.split('');

const KID_COLORS = [
  'bg-red-400 text-white',
  'bg-blue-400 text-white',
  'bg-green-400 text-white',
  'bg-yellow-400 text-blue-900',
  'bg-purple-400 text-white',
  'bg-pink-400 text-white',
  'bg-orange-400 text-white',
  'bg-teal-400 text-white',
  'bg-indigo-400 text-white'
];

const SubharatiPuzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  const initializeGame = () => {
    let shuffled;
    do {
      shuffled = [...TARGET_ARRAY].sort(() => Math.random() - 0.5);
    } while (shuffled.join('') === TARGET_WORD);
    
    // Give each tile a unique ID and a random color for kids
    setTiles(shuffled.map((letter, i) => ({ 
      id: Math.random().toString(36).substr(2, 9), 
      letter,
      colorClass: KID_COLORS[i % KID_COLORS.length]
    })));
    setSelectedIndex(null);
    setIsSolved(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleTileClick = (index) => {
    if (isSolved) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex === index) {
        setSelectedIndex(null); // Deselect
        return;
      }

      // Swap tiles
      const newTiles = [...tiles];
      const temp = newTiles[selectedIndex];
      newTiles[selectedIndex] = newTiles[index];
      newTiles[index] = temp;
      
      setTiles(newTiles);
      setSelectedIndex(null);

      // Check win condition
      if (newTiles.map(t => t.letter).join('') === TARGET_WORD) {
        setIsSolved(true);
      }
    }
  };

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="section-container text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-200 mb-6">
          <Puzzle className="w-5 h-5 text-orange-500" />
          <span className="text-sm font-bold uppercase tracking-wider text-orange-700">Kids Zone</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Spell <span className="text-orange-500">Subharati!</span>
        </h2>
        <p className="text-slate-600 mb-10 max-w-md mx-auto">
          Click two blocks to swap them and spell the word correctly!
        </p>

        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 shadow-lg mb-8">
          <div className="flex flex-wrap justify-center gap-3 min-h-[100px]">
            {tiles.map((tile, index) => {
              const isCorrect = isSolved || tile.letter === TARGET_ARRAY[index];
              
              return (
                <motion.button
                  key={tile.id}
                  layout
                  onClick={() => handleTileClick(index)}
                  className={`
                    relative w-14 h-16 md:w-16 md:h-18 rounded-xl flex items-center justify-center
                    text-2xl md:text-3xl font-bold shadow-md transition-all
                    ${selectedIndex === index ? 'ring-3 ring-orange-400 ring-offset-2 scale-105 z-10' : 'hover:scale-105'}
                    ${isSolved ? 'bg-green-500 text-white' : 
                      isCorrect ? 'bg-green-100 text-green-700 border-2 border-green-300' : 
                      tile.colorClass}
                  `}
                  whileTap={{ scale: 0.95 }}
                  animate={isSolved ? { 
                    y: [0, -10, 0],
                    transition: { duration: 0.4, repeat: Infinity, repeatType: "reverse", delay: index * 0.05 }
                  } : {}}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  disabled={isSolved}
                >
                  {tile.letter}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="h-20 flex flex-col items-center justify-center">
          {isSolved ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2 text-green-600 font-bold text-xl bg-green-50 px-6 py-3 rounded-full border-2 border-green-200">
                <Sparkles className="w-5 h-5" />
                Great job!
                <Sparkles className="w-5 h-5" />
              </div>
              <button 
                onClick={initializeGame}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" /> Play Again
              </button>
            </motion.div>
          ) : (
            <button 
              onClick={initializeGame}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
            >
              <RefreshCcw className="w-4 h-4" /> Scramble Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default SubharatiPuzzle;
