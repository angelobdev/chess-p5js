function Matrix(x, y) {
  const mtrx = [];
  for (let i = 0; i < x; i++) {
    mtrx[i] = new Array(y).fill(null);
  }
  return mtrx;
}
