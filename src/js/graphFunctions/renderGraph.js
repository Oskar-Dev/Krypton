const renderGraph = (canvasContext, centerX, centerY, points, scale, rotateGraph) => {
  if (points.length <= 1 || points === undefined) return;
  centerY -= 16;

  canvasContext.beginPath();

  const graphHeight = window.innerHeight;
  const graphWidth = window.innerWidth;

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y, hole, lim, holeX } = point;

    if (rotateGraph) [x, y] = [y, x];

    if (hole) canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    else canvasContext.lineTo(centerX + x * scale, centerY - y * scale);

    if (lim === 1) {
      if (rotateGraph) canvasContext.lineTo(graphWidth * 1.4, centerY - holeX * scale);
      else canvasContext.lineTo(centerX + holeX * scale, 0);

      canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    } else if (lim === -1) {
      if (rotateGraph) canvasContext.lineTo(0, centerY - holeX * scale);
      else canvasContext.lineTo(centerX + holeX * scale, graphHeight * 1.8);
      canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    }
  }

  canvasContext.stroke();
  // canvasContext.closePath();
};

export default renderGraph;
