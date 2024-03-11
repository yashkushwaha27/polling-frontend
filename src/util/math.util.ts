const generateRandomFiveDigit = () => {
  const min = 10000; // Minimum 5-digit number
  const max = 99999; // Maximum 5-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export { generateRandomFiveDigit };
