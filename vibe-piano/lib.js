function dbg(x) {
  console.trace(x);
  return x;
}

function invert(arr) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    result[arr[i]] = i;
  }
  return result;
}
