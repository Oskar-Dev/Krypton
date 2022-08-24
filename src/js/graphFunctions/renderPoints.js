import { settings } from '../../utils/globalSettings';
import { themes } from '../../utils/themes';

const renderPoints = (canvasContext, centerX, centerY, points, scale, size, style, label) => {
  if (points.length < 1 || points === undefined) return;
  centerY -= 16;

  // var radius = style === 0 ? size : size;
  var radius = parseFloat(size);
  canvasContext.lineWidth = size * 2;

  var fillColor = themes[settings.general.theme]['--color-primary-600'];
  var labelColor = themes[settings.general.theme]['--color-text'];

  for (var i = 0, n = points.length; i < n; i++) {
    var point = points[i];
    var { x, y } = point;

    // canvasContext.moveTo(centerX + x * scale, centerY - y * scale);
    canvasContext.beginPath();
    canvasContext.arc(centerX + x * scale, centerY - y * scale, radius, 0, Math.PI * 2);
    canvasContext.stroke();

    if (style === 1) {
      canvasContext.fillStyle = fillColor;
      canvasContext.fill();
    }

    // render labels
    canvasContext.fillStyle = labelColor;
    canvasContext.fillText(label, centerX + x * scale, centerY - y * scale + radius * 2 + 10);
  }
};

export default renderPoints;
