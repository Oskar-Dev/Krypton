const renderGraph = (canvasContext, centerX, centerY, points, scale) => {
  if (points.length <= 1 || points === undefined) return;
  // canvas = canvasRef.current;
  // context = canvas.getContext('2d');

  canvasContext.beginPath();

  // const n = Math.floor(width / (2 * scale) + 5);
  // const quality = 0.085;
  // const quality = 0.002;
  // const h = 0.0000001;
  // const delta = 0.0005;
  // const asymptoteQuality = 25;

  // const n = Math.floor(width / (2 * scale) + 5);
  // var offsetX = Math.ceil((baseCenterX - cx) / gridSize);

  // var functionData = evaluateFunction(f, -n + offsetX, n + offsetX, quality);

  // for (var i = 0; i < functionData.length - 1; i++) {
  //   var data_0 = functionData[i];
  //   var data_1 = functionData[i + 1];

  //   var x_0 = data_0.argument;
  //   var x_1 = data_1.argument;

  //   var value_0 = data_0.value;
  //   var value_1 = data_1.value;

  //   if (isNaN(parseFloat(value_0)) && isNaN(parseFloat(value_1))) continue;

  //   var derivativeAtX_0 = derivativeAtPoint(f, x_0, h);
  //   var derivativeAtX_1 = derivativeAtPoint(f, x_1, h);

  //   // check for asymptotes
  //   if (isVerticalAsymptote(derivativeAtX_0, derivativeAtX_1, value_0, value_1)) {
  //     var asymptoteData = findVerticalAsymptote(f, h, asymptoteQuality, x_0, x_1);
  //     if (asymptoteData.asymptote == false) continue;

  //     var asymptote = asymptoteData.value;
  //     if (!isFinite(value_0) && !isFinite(value_1)) continue;
  //     if (
  //       Math.abs(f(asymptote - delta) - f(asymptote + delta)) < 0.2 &&
  //       Math.abs(derivativeAtPoint(f, asymptote - delta, h)) < 2 &&
  //       Math.abs(derivativeAtPoint(f, asymptote + delta, h)) < 2
  //     )
  //       continue;

  //     var top = cy - baseCenterY + height / 2;
  //     var bottom = cy - baseCenterY - height / 2;

  //     if (value_0 == undefined && value_1 !== undefined) {
  //       if (derivativeAtX_1 > 0) {
  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);
  //       } else {
  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);
  //       }

  //       canvasContext.stroke();
  //       continue;
  //     } else if (value_0 != undefined && value_1 == undefined) {
  //       if (derivativeAtX_0 > 0) {
  //         canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);
  //       } else {
  //         canvasContext.moveTo(cx + x_0 * scale, cy - value_0 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);
  //       }

  //       context.lineWidth++;
  //       canvasContext.stroke();
  //       context.lineWidth--;
  //       continue;
  //     }

  //     if (Math.sign(derivativeAtX_0) == -1 && Math.sign(derivativeAtX_1) == 1) {
  //       canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);

  //       canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //       canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);

  //       canvasContext.stroke();
  //       continue;
  //     } else if (Math.sign(derivativeAtX_0) == 1 && Math.sign(derivativeAtX_1) == -1) {
  //       canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);

  //       canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //       canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);

  //       canvasContext.stroke();
  //       continue;
  //     }

  //     if (x_0 !== asymptote && x_1 !== asymptote) {
  //       if (derivativeAtX_0 > 0 && value_0 > value_1) {
  //         canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);

  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);
  //       } else if (derivativeAtX_0 < 0 && value_0 < value_1) {
  //         canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);

  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);
  //       }

  //       canvasContext.stroke();
  //     } else if (x_0 == asymptote) {
  //       if (derivativeAtX_1 > 0) {
  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);
  //       } else if (derivativeAtX_1 < 0) {
  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);
  //       }
  //     } else if (x_1 == asymptote) {
  //       if (derivativeAtX_0 > 0) {
  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - top - 250);
  //       } else if (derivativeAtX_1 < 0) {
  //         canvasContext.moveTo(cx + x_1 * scale, cy - value_1 * scale);
  //         canvasContext.lineTo(cx + asymptote * scale, cy - bottom + 250);
  //       }

  //       canvasContext.stroke();
  //     }

  //     continue;
  //   }

  //   canvasContext.moveTo(cx + x_0 * scale, cy - value_0 * scale);
  //   canvasContext.lineTo(cx + x_1 * scale, cy - value_1 * scale);
  //   canvasContext.stroke();
  // }

  const graphWidth = window.innerWidth * 0.75;
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
