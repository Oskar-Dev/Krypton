const renderPoints = (canvasContext, centerX, centerY, points, scale, size, style) => {
  if (points.length < 1 || points === undefined) return;

  canvasContext.beginPath();

  var radius = style === 0 ? size : size;

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y } = point;

    canvasContext.arc(centerX + x * scale, centerY - y * scale, radius, 0, Math.PI * 2);
  }

  canvasContext.lineWidth = size * 2;
  canvasContext.stroke();

  if (style === 1) {
    canvasContext.fillStyle = '#181717';
    canvasContext.fill();
  }
};

export default renderPoints;
