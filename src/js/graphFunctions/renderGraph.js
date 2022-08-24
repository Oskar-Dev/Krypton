const renderGraph = (canvasContext, centerX, centerY, points, scale) => {
  if (points.length <= 1 || points === undefined) return;
  centerY -= 16;

  canvasContext.beginPath();

  const graphHeight = window.innerHeight;

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y, hole, lim, holeX } = point;

    if (hole) canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    else canvasContext.lineTo(centerX + x * scale, centerY - y * scale);

    if (lim === 1) {
      canvasContext.lineTo(centerX + holeX * scale, 0);
      canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    } else if (lim === -1) {
      canvasContext.lineTo(centerX + holeX * scale, graphHeight * 1.8);
      canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    }
  }

  canvasContext.stroke();
  // canvasContext.closePath();
};

export default renderGraph;
