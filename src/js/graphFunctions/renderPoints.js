const renderPoints = (canvasContext, centerX, centerY, points, scale, size, style, label) => {
  if (points.length < 1 || points === undefined) return;
  centerY -= 16 + 1;

  // var radius = style === 0 ? size : size;
  var radius = parseFloat(size);
  canvasContext.lineWidth = size * 2;

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y } = point;

    // canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    canvasContext.beginPath();
    canvasContext.arc(centerX + x * scale, centerY - y * scale, radius, 0, Math.PI * 2);
    canvasContext.stroke();

    if (style === 1) {
      canvasContext.fillStyle = '#181717';
      canvasContext.fill();
    }

    // render labels
    canvasContext.fillStyle = '#fff';
    canvasContext.fillText(label, centerX + x * scale, centerY - y * scale + radius * 2 + 10);
  }
};

export default renderPoints;
