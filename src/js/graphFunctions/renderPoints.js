const renderPoints = (canvasContext, centerX, centerY, points, scale) => {
  if (points.length < 1 || points === undefined) return;

  canvasContext.beginPath();

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y } = point;

    canvasContext.arc(centerX + x * scale, centerY - y * scale, 5, 0, Math.PI * 2);
  }

  canvasContext.stroke();
};

export default renderPoints;
