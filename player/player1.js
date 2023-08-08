function run(board) {
  for (let row = 0, len = board?.length; row < len; row++) {
    for (let column = 0, len = board?.[row]?.length; column < len; column++) {
      if (board?.[row]?.[column] === 0) {
        return [row, column];
      }
    }
  }
  return [0, 0];
}
