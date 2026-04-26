import React, { useState, useEffect, useRef } from 'react';
import { Target, RotateCcw, AlertCircle, CheckCircle2, ChevronRight, Hash } from 'lucide-react';

const App = () => {
  // Game Constants
  const MIN_NUMBER = 1;
  const MAX_NUMBER = 100;
  const MAX_ATTEMPTS = 7;

  // State Management
  const [targetNumber, setTargetNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState([]);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [error, setError] = useState('');
  
  const historyEndRef = useRef(null);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  // Auto-scroll history
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const startNewGame = () => {
    setTargetNumber(Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER);
    setAttempts(0);
    setHistory([]);
    setGameState('playing');
    setGuess('');
    setError('');
  };

  const handleGuess = (e) => {
    e.preventDefault();
    setError('');

    const numericGuess = parseInt(guess);

    // Validation logic (simulating the Java try-catch/if logic)
    if (isNaN(numericGuess)) {
      setError('Invalid input! Please enter a whole number.');
      return;
    }

    if (numericGuess < MIN_NUMBER || numericGuess > MAX_NUMBER) {
      setError(`Out of bounds! Please guess between ${MIN_NUMBER} and ${MAX_NUMBER}.`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let feedback = '';
    let status = 'neutral';

    if (numericGuess === targetNumber) {
      setGameState('won');
      feedback = 'Correct! You found it!';
      status = 'success';
    } else if (numericGuess < targetNumber) {
      feedback = 'Too LOW! Try a higher number.';
      status = 'low';
    } else {
      feedback = 'Too HIGH! Try a lower number.';
      status = 'high';
    }

    setHistory([...history, { guess: numericGuess, feedback, status, attempt: newAttempts }]);
    setGuess('');

    if (numericGuess !== targetNumber && newAttempts >= MAX_ATTEMPTS) {
      setGameState('lost');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans text-slate-900 relative overflow-hidden bg-black">
      
      {/* OPTICAL ILLUSION BACKGROUND */}
      <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        {/* Hypnotic Spiral Layer */}
        <div 
          className="absolute w-[300%] h-[300%] animate-spin-slow"
          style={{
            background: `repeating-conic-gradient(
              from 0deg,
              #064e3b 0deg 15deg,
              #022c22 15deg 30deg,
              #065f46 30deg 45deg,
              #000000 45deg 60deg
            )`
          }}
        />
        {/* Pulsing Overlay to create depth friction */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black animate-pulse duration-[4000ms]"></div>
        
        {/* Floating Perspective Grid */}
        <div className="absolute inset-0 opacity-20"
             style={{ 
               backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', 
               backgroundSize: '100px 100px',
               perspective: '500px',
               transform: 'rotateX(60deg) scale(3) translateY(0%)',
             }}>
        </div>
      </div>

      {/* GAME CARD - Floating in the illusion */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_0_100px_rgba(16,185,129,0.3)] overflow-hidden border border-white/40 relative z-10 transition-transform hover:scale-[1.01] duration-500">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                <Target className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Number Hunter</h1>
            <p className="text-emerald-100 text-[10px] mt-1 font-black tracking-[0.3em] opacity-80 uppercase">Internship Prototype V1</p>
          </div>
        </div>

        <div className="p-8">
          {/* Game Stats */}
          <div className="flex justify-between items-center mb-8 bg-black/5 p-5 rounded-2xl border border-black/5">
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Current Range</p>
              <p className="text-xl font-black text-slate-800">{MIN_NUMBER} <span className="text-emerald-500 mx-1">/</span> {MAX_NUMBER}</p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Lives Left</p>
              <p className={`text-xl font-black transition-colors ${MAX_ATTEMPTS - attempts <= 2 ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
                {MAX_ATTEMPTS - attempts}
              </p>
            </div>
          </div>

          {/* Game Body */}
          {gameState === 'playing' ? (
            <form onSubmit={handleGuess} className="space-y-5">
              <div className="group">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Input Prediction</label>
                <div className="relative">
                  <input
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-xl font-bold outline-none shadow-inner"
                    placeholder="E.g. 73"
                    autoFocus
                  />
                  <Hash className="absolute left-4 top-4 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                </div>
                {error && (
                  <p className="mt-3 text-sm text-rose-600 font-bold flex items-center gap-2 bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 group overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-3 uppercase tracking-wider">
                  Fire Guess <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          ) : (
            /* Result Screens */
            <div className="text-center py-4 space-y-5">
              {gameState === 'won' ? (
                <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-2xl shadow-emerald-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white/20 p-4 rounded-full animate-bounce">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">Success!</h2>
                    <p className="mt-2 text-emerald-50 font-medium">
                      Cracked in <span className="bg-white text-emerald-700 px-2 py-0.5 rounded-md font-black">{attempts}</span> attempts.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-600 p-8 rounded-3xl text-white shadow-2xl shadow-rose-200">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 p-4 rounded-full">
                      <AlertCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase">Defeat</h2>
                  <p className="mt-2 text-rose-50 font-medium">
                    The code was <span className="bg-white text-rose-700 px-3 py-1 rounded-lg font-black text-2xl ml-1 tracking-widest">{targetNumber}</span>
                  </p>
                </div>
              )}
              
              <button
                onClick={startNewGame}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg"
              >
                <RotateCcw className="w-5 h-5" /> Initialize New Hunt
              </button>
            </div>
          )}

          {/* History / Game Log */}
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[1px] flex-grow bg-slate-200"></div>
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">System History</h3>
              <div className="h-[1px] flex-grow bg-slate-200"></div>
            </div>
            
            <div className="h-40 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-10 italic">
                  <Target className="w-8 h-8 mb-2" />
                  <p className="text-xs font-bold tracking-widest">Awaiting Inputs...</p>
                </div>
              ) : (
                history.slice().reverse().map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] ${
                      item.status === 'success' ? 'bg-emerald-50 border-emerald-100 shadow-emerald-50 shadow-sm' : 
                      item.status === 'high' ? 'bg-amber-50 border-amber-100 shadow-amber-50 shadow-sm' : 
                      'bg-sky-50 border-sky-100 shadow-sky-50 shadow-sm'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm border ${
                      item.status === 'success' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white text-slate-400 border-slate-100'
                    }`}>
                      {item.attempt}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-black text-slate-800 uppercase">Input: {item.guess}</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          item.status === 'success' ? 'bg-emerald-200 text-emerald-800' : 
                          item.status === 'high' ? 'bg-amber-200 text-amber-800' : 
                          'bg-sky-200 text-sky-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{item.feedback}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={historyEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
