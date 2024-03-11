import { useState, useEffect } from "react";

const useDecrementalCounter = (initialSeconds: number) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [startDecrement, setStartDecrement] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (startDecrement && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else if (seconds === 0) {
      setIsFinished(true);
    }
  }, [startDecrement, seconds]);

  const startCountdown = (initialSeconds?: number) => {
    initialSeconds && setSeconds(initialSeconds);
    setStartDecrement(true);
    setIsFinished(false);
  };

  return { seconds, isFinished, startCountdown };
};

export default useDecrementalCounter;
