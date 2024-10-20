import React, { useState, useEffect } from "react";

export default function CountdownTimer({ initialTime }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(timeLeft);

  return (
    <div className="flex space-x-3">
      <div className="text-center flex items-center justify-center bg-black rounded-md h-7 w-9">
        <span className="block font-semibold text-md select-none text-white">
          {hours}
        </span>
      </div>
      <div className="text-center flex items-center justify-center bg-black rounded-md h-7 w-9">
        <span className="block font-semibold text-md select-none text-white">
          {minutes}
        </span>
      </div>
      <div className="text-center flex items-center justify-center bg-black rounded-md h-7 w-9">
        <span className="block font-semibold text-md select-none text-white">
          {seconds}
        </span>
      </div>
    </div>
  );
}
