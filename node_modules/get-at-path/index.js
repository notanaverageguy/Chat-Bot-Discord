function getAtPath(object, path) {
  var current = object;
  if (path.every(segmentExists, true)) {
    return current;
  }

  function segmentExists(segment) {
    current = current[segment];
    return current;
  }
}

module.exports = getAtPath;
