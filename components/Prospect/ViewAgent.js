import  {React, useState, useEffect } from "react";

export default function ViewAgentComponent() {
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Update the timer every second when running
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor(Date.now() / 1000) - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isRunning, startTime]);

  // Start Timer
  const handleStart = () => {
    const now = Math.floor(Date.now() / 1000);
    setStartTime(now);
    setElapsedTime(0);
    setIsRunning(true);
  };

  // Stop Timer & Save Time
  const handleEnd = () => {
    setIsRunning(false);
    localStorage.setItem("elapsedTime", elapsedTime);
    alert(`Time Saved: ${elapsedTime} seconds`);
  };

  // Convert elapsed seconds to hh:mm:ss format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Timer</h1>
      <p className="text-xl mt-4">Elapsed Time: {formatTime(elapsedTime)}</p>

      <div className="mt-4">
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
          disabled={isRunning}
        >
          Start
        </button>
        <button
          onClick={handleEnd}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
          disabled={!isRunning}
        >
          End
        </button>
      </div>
    </div>
  );
}
