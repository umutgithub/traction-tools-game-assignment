export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

  // Collect indices of empty squares and return them
  export const getEmptySquares = (grid) => {
    let squares = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };