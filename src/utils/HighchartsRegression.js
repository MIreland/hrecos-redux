/* Code extracted from https://github.com/Tom-Alexander/regression-js/

 Modifications of January 5, 2015

 - Add dashStyle ('' by default)

 */

import ReactHighcharts from 'react-highcharts';

(function (H) {
  H.wrap(H.Chart.prototype, 'init', function (proceed) {
    const series = arguments[1].series;
    const extraSeries = [];
    let i = 0;
    for (i = 0; i < series.length; i++) {
      const s = series[i];
      if (s.regression && !s.rendered) {
        s.regressionSettings = s.regressionSettings || {};
        s.regressionSettings.tooltip = s.regressionSettings.tooltip || {};
        s.regressionSettings.dashStyle = s.regressionSettings.dashStyle || 'solid';
        s.regressionSettings.decimalPlaces = s.regressionSettings.decimalPlaces || 2;
        s.regressionSettings.useAllSeries = s.regressionSettings.useAllSeries || false;

        const regressionType = s.regressionSettings.type || 'linear';
        var regression;
        const extraSerie = {
          data: [],
          color: s.color,
          yAxis: s.yAxis,
          lineWidth: 2,
          marker: { enabled: false },
          isRegressionLine: true,
          visible: s.regressionSettings.visible,
          type: s.regressionSettings.linetype || 'spline',
          name: s.regressionSettings.name || 'Equation: %eq',
          id: s.regressionSettings.id,
          color: s.regressionSettings.color || '',
          dashStyle: s.regressionSettings.dashStyle || 'solid',
          showInLegend: !s.regressionSettings.hideInLegend,
          tooltip: {
            valueSuffix: s.regressionSettings.tooltip.valueSuffix || ' ',
          },
        };

        let mergedData = s.data;
        if (s.regressionSettings.useAllSeries) {
          mergedData = [];
          for (di = 0; di < series.length; di++) {
            const seriesToMerge = series[di];
            mergedData = mergedData.concat(seriesToMerge.data);
          }
        }

        if (regressionType == 'linear') {
          regression = _linear(mergedData, s.regressionSettings.decimalPlaces);
          extraSerie.type = 'line';
        } else if (regressionType == 'exponential') {
          regression = _exponential(mergedData);
        } else if (regressionType == 'polynomial') {
          const order = s.regressionSettings.order || 2;
          const extrapolate = s.regressionSettings.extrapolate || 0;
          regression = _polynomial(mergedData, order, extrapolate);
        } else if (regressionType == 'logarithmic') {
          regression = _logarithmic(mergedData);
        } else if (regressionType == 'loess') {
          const loessSmooth = s.regressionSettings.loessSmooth || 25;
          regression = _loess(mergedData, loessSmooth / 100);
        } else {
          console.error('Invalid regression type: ', regressionType);
          break;
        }

        regression.rSquared = coefficientOfDetermination(mergedData, regression.points);
        regression.rValue = Math.sqrt(regression.rSquared).toFixed(s.regressionSettings.decimalPlaces);
        regression.rSquared = regression.rSquared.toFixed(s.regressionSettings.decimalPlaces);
        regression.standardError = standardError(mergedData, regression.points).toFixed(s.regressionSettings.decimalPlaces);
        extraSerie.data = regression.points;
        extraSerie.name = extraSerie.name.replace('%r2', regression.rSquared);
        extraSerie.name = extraSerie.name.replace('%r', regression.rValue);
        extraSerie.name = extraSerie.name.replace('%eq', regression.string);
        extraSerie.name = extraSerie.name.replace('%se', regression.standardError);

        if (extraSerie.visible == false) {
          extraSerie.visible = false;
        }

        extraSerie.regressionOutputs = regression;
        extraSeries.push(extraSerie);
        arguments[1].series[i].rendered = true;
      }
    }

    arguments[1].series = series.concat(extraSeries);

    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
  });

  /**
   * Code extracted from https://github.com/Tom-Alexander/regression-js/
   */
  function _exponential(data) {
    const sum = [0, 0, 0, 0, 0, 0]; let n = 0; const
      results = [];

    for (len = data.length; n < len; n++) {
      if (data[n].x != null) {
        data[n][0] = data[n].x;
        data[n][1] = data[n].y;
      }
      if (data[n][1] != null) {
        sum[0] += data[n][0]; // X
        sum[1] += data[n][1]; // Y
        sum[2] += data[n][0] * data[n][0] * data[n][1]; // XXY
        sum[3] += data[n][1] * Math.log(data[n][1]); // Y Log Y
        sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]); // YY Log Y
        sum[5] += data[n][0] * data[n][1]; // XY
      }
    }

    const denominator = (sum[1] * sum[2] - sum[5] * sum[5]);
    const A = Math.pow(Math.E, (sum[2] * sum[3] - sum[5] * sum[4]) / denominator);
    const B = (sum[1] * sum[4] - sum[5] * sum[3]) / denominator;

    for (var i = 0, len = data.length; i < len; i++) {
      const coordinate = [data[i][0], A * Math.pow(Math.E, B * data[i][0])];
      results.push(coordinate);
    }

    results.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    const string = `y = ${Math.round(A * 100) / 100}e^(${Math.round(B * 100) / 100}x)`;

    return { equation: [A, B], points: results, string };
  }

  /**
   * Code extracted from https://github.com/Tom-Alexander/regression-js/
   * Human readable formulas:
   *
   *              N * Σ(XY) - Σ(X)
   * intercept = ---------------------
   *              N * Σ(X^2) - Σ(X)^2
   *
   * correlation = N * Σ(XY) - Σ(X) * Σ (Y) / √ (  N * Σ(X^2) - Σ(X) ) * ( N * Σ(Y^2) - Σ(Y)^2 ) ) )
   *
   */
  function _linear(data, decimalPlaces) {
    const sum = [0, 0, 0, 0, 0]; let n = 0; const results = []; let
      N = data.length;

    for (; n < data.length; n++) {
      if (data[n].x != null) {
        data[n][0] = data[n].x;
        data[n][1] = data[n].y;
      }
      if (data[n][1] != null) {
        sum[0] += data[n][0]; // Σ(X)
        sum[1] += data[n][1]; // Σ(Y)
        sum[2] += data[n][0] * data[n][0]; // Σ(X^2)
        sum[3] += data[n][0] * data[n][1]; // Σ(XY)
        sum[4] += data[n][1] * data[n][1]; // Σ(Y^2)
      } else {
        N -= 1;
      }
    }

    const gradient = (N * sum[3] - sum[0] * sum[1]) / (N * sum[2] - sum[0] * sum[0]);
    const intercept = (sum[1] / N) - (gradient * sum[0]) / N;
    // var correlation = (N * sum[3] - sum[0] * sum[1]) / Math.sqrt((N * sum[2] - sum[0] * sum[0]) * (N * sum[4] - sum[1] * sum[1]));

    for (let i = 0, len = data.length; i < len; i++) {
      let coorY = data[i][0] * gradient + intercept;
      if (decimalPlaces) { coorY = parseFloat(coorY.toFixed(decimalPlaces)); }
      const coordinate = [data[i][0], coorY];
      results.push(coordinate);
    }

    results.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    const string = `y = ${Math.round(gradient * 100) / 100}x + ${Math.round(intercept * 100) / 100}`;
    return { equation: [gradient, intercept], points: results, string };
  }

  /**
   *  Code extracted from https://github.com/Tom-Alexander/regression-js/
   */
  function _logarithmic(data) {
    const sum = [0, 0, 0, 0]; let n = 0; const results = []; const
      mean = 0;

    for (len = data.length; n < len; n++) {
      if (data[n].x != null) {
        data[n][0] = data[n].x;
        data[n][1] = data[n].y;
      }
      if (data[n][1] != null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += data[n][1] * Math.log(data[n][0]);
        sum[2] += data[n][1];
        sum[3] += Math.pow(Math.log(data[n][0]), 2);
      }
    }

    const B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
    const A = (sum[2] - B * sum[0]) / n;

    for (var i = 0, len = data.length; i < len; i++) {
      const coordinate = [data[i][0], A + B * Math.log(data[i][0])];
      results.push(coordinate);
    }

    results.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    const string = `y = ${Math.round(A * 100) / 100} + ${Math.round(B * 100) / 100} ln(x)`;

    return { equation: [A, B], points: results, string };
  }

  /**
   * Code extracted from https://github.com/Tom-Alexander/regression-js/
   */
  function _power(data) {
    const sum = [0, 0, 0, 0]; let n = 0; const
      results = [];

    for (len = data.length; n < len; n++) {
      if (data[n].x != null) {
        data[n][0] = data[n].x;
        data[n][1] = data[n].y;
      }
      if (data[n][1] != null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += Math.log(data[n][1]) * Math.log(data[n][0]);
        sum[2] += Math.log(data[n][1]);
        sum[3] += Math.pow(Math.log(data[n][0]), 2);
      }
    }

    const B = (n * sum[1] - sum[2] * sum[0]) / (n * sum[3] - sum[0] * sum[0]);
    const A = Math.pow(Math.E, (sum[2] - B * sum[0]) / n);

    for (var i = 0, len = data.length; i < len; i++) {
      const coordinate = [data[i][0], A * Math.pow(data[i][0], B)];
      results.push(coordinate);
    }

    results.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    const string = `y = ${Math.round(A * 100) / 100}x^${Math.round(B * 100) / 100}`;

    return { equation: [A, B], points: results, string };
  }

  /**
   * Code extracted from https://github.com/Tom-Alexander/regression-js/
   */
  function _polynomial(data, order, extrapolate) {
    if (typeof order === 'undefined') {
      order = 2;
    }
    const lhs = []; const rhs = []; const results = []; let a = 0; let b = 0; var i = 0; const
      k = order + 1;

    for (; i < k; i++) {
      for (var l = 0, len = data.length; l < len; l++) {
        if (data[l].x != null) {
          data[l][0] = data[l].x;
          data[l][1] = data[l].y;
        }
        if (data[l][1] != null) {
          a += Math.pow(data[l][0], i) * data[l][1];
        }
      }
      lhs.push(a), a = 0;
      const c = [];
      for (let j = 0; j < k; j++) {
        for (var l = 0, len = data.length; l < len; l++) {
          if (data[l][1]) {
            b += Math.pow(data[l][0], i + j);
          }
        }
        c.push(b), b = 0;
      }
      rhs.push(c);
    }
    rhs.push(lhs);

    const equation = gaussianElimination(rhs, k);

    const resultLength = data.length + extrapolate;
    const step = data[data.length - 1][0] - data[data.length - 2][0];
    for (var i = 0, len = resultLength; i < len; i++) {
      let answer = 0;
      if (typeof data[i] !== 'undefined') {
        var x = data[i][0];
      } else {
        var x = data[data.length - 1][0] + (i - data.length) * step;
      }

      for (let w = 0; w < equation.length; w++) {
        answer += equation[w] * Math.pow(x, w);
      }
      results.push([x, answer]);
    }

    results.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    let string = 'y = ';

    for (var i = equation.length - 1; i >= 0; i--) {
      if (i > 1) string += `${Math.round(equation[i] * 100) / 100}x^${i} + `;
      else if (i == 1) string += `${Math.round(equation[i] * 100) / 100}x` + ' + ';
      else string += Math.round(equation[i] * 100) / 100;
    }

    return { equation, points: results, string };
  }

  /**
   * @author: Ignacio Vazquez
   * Based on
   * - http://commons.apache.org/proper/commons-math/download_math.cgi LoesInterpolator.java
   * - https://gist.github.com/avibryant/1151823
   */
  function _loess(data, bandwidth) {
    var bandwidth = bandwidth || 0.25;

    const xval = data.map(pair => pair[0]);
    const distinctX = array_unique(xval);
    if (2 / distinctX.length > bandwidth) {
      bandwidth = Math.min(2 / distinctX.length, 1);
      console.warn(`updated bandwith to ${bandwidth}`);
    }

    const yval = data.map(pair => pair[1]);

    function array_unique(values) {
      const o = {}; let i; const l = values.length; const
        r = [];
      for (i = 0; i < l; i += 1) o[values[i]] = values[i];
      for (i in o) r.push(o[i]);
      return r;
    }

    function tricube(x) {
      const tmp = 1 - x * x * x;
      return tmp * tmp * tmp;
    }

    const res = [];

    let left = 0;
    let right = Math.floor(bandwidth * xval.length) - 1;

    for (const i in xval) {
      const x = xval[i];

      if (i > 0) {
        if (right < xval.length - 1
          && xval[right + 1] - xval[i] < xval[i] - xval[left]) {
          left++;
          right++;
        }
      }
      // console.debug("left: "+left  + " right: " + right );
      var edge;
      if (xval[i] - xval[left] > xval[right] - xval[i]) { edge = left; } else { edge = right; }
      const denom = Math.abs(1.0 / (xval[edge] - x));
      let sumWeights = 0;
      let sumX = 0; let sumXSquared = 0; let sumY = 0; let
        sumXY = 0;

      let k = left;
      while (k <= right) {
        const xk = xval[k];
        const yk = yval[k];
        var dist;
        if (k < i) {
          dist = (x - xk);
        } else {
          dist = (xk - x);
        }
        const w = tricube(dist * denom);
        const xkw = xk * w;
        sumWeights += w;
        sumX += xkw;
        sumXSquared += xk * xkw;
        sumY += yk * w;
        sumXY += yk * xkw;
        k++;
      }

      const meanX = sumX / sumWeights;
      // console.debug(meanX);
      const meanY = sumY / sumWeights;
      const meanXY = sumXY / sumWeights;
      const meanXSquared = sumXSquared / sumWeights;

      var beta;
      if (meanXSquared == meanX * meanX) { beta = 0; } else { beta = (meanXY - meanX * meanY) / (meanXSquared - meanX * meanX); }

      const alpha = meanY - beta * meanX;
      res[i] = beta * x + alpha;
    }
    // console.debug(res);
    return {
      equation: '',
      points: xval.map((x, i) => [x, res[i]]),
      string: '',
    };
  }

  /**
   * Code extracted from https://github.com/Tom-Alexander/regression-js/
   */
  function gaussianElimination(a, o) {
    let i = 0; let j = 0; let k = 0; let maxrow = 0; let tmp = 0; const n = a.length - 1; const
      x = new Array(o);
    for (i = 0; i < n; i++) {
      maxrow = i;
      for (j = i + 1; j < n; j++) {
        if (Math.abs(a[i][j]) > Math.abs(a[i][maxrow])) { maxrow = j; }
      }
      for (k = i; k < n + 1; k++) {
        tmp = a[k][i];
        a[k][i] = a[k][maxrow];
        a[k][maxrow] = tmp;
      }
      for (j = i + 1; j < n; j++) {
        for (k = n; k >= i; k--) {
          a[k][j] -= a[k][i] * a[i][j] / a[i][i];
        }
      }
    }
    for (j = n - 1; j >= 0; j--) {
      tmp = 0;
      for (k = j + 1; k < n; k++) { tmp += a[k][j] * x[k]; }
      x[j] = (a[n][j] - tmp) / a[j][j];
    }
    return (x);
  }

  /**
   * @author Ignacio Vazquez
   * See http://en.wikipedia.org/wiki/Coefficient_of_determination for theaorical details
   */
  function coefficientOfDetermination(data, pred) {
    let i = SSE = SSYY = mean = 0; let
      N = data.length;

    // Sort the initial data { pred array (model's predictions) is sorted  }
    // The initial data must be sorted in the same way in order to calculate the coefficients
    data.sort((a, b) => {
      if (a[0] > b[0]) { return 1; }
      if (a[0] < b[0]) { return -1; }
      return 0;
    });

    // Calc the mean
    for (i = 0; i < data.length; i++) {
      if (data[i][1] != null) {
        mean += data[i][1];
      } else {
        N--;
      }
    }
    mean /= N;

    // Calc the coefficent of determination
    for (i = 0; i < data.length; i++) {
      if (data[i][1] != null) {
        SSYY += Math.pow(data[i][1] - pred[i][1], 2);
        SSE += Math.pow(data[i][1] - mean, 2);
      }
    }
    return 1 - (SSYY / SSE);
  }

  function standardError(data, pred) {
    let SE = 0; let
      N = data.length;

    for (i = 0; i < data.length; i++) {
      if (data[i][1] != null) {
        SE += Math.pow(data[i][1] - pred[i][1], 2);
      } else {
        N--;
      }
    }
    SE = Math.sqrt(SE / (N - 2));

    return SE;
  }
}(ReactHighcharts.Highcharts));
