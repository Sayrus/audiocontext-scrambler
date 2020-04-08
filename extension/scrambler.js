function createCustomChannelData(target) {
  const original = target.prototype.getChannelData;
  let buffer = null;
  let getChannelData = function () {
    const originalResult = original.apply(this, arguments);
    if (buffer !== originalResult) {
      browser.runtime.sendMessage({content: window.top.location.href});
      buffer = originalResult;
      for (var i = 0; i < originalResult.length; i += 100) {
        let index = Math.floor(Math.random() * i);
        originalResult[index] = originalResult[index] + Math.random() * 0.0000001;
      }
    }
    return originalResult;
  };
  exportFunction(getChannelData, target.prototype, {defineAs:'getChannelData'});
}

function createCustomAnalyserNode(target) {
  const original = target.prototype.getFloatFrequencyData;
  let getFloatFrequencyData = function () {
    const originalResult = original.apply(this, arguments);
    browser.runtime.sendMessage({content: window.top.location.href});
    for (var i = 0; i < arguments[0].length; i += 100) {
      let index = Math.floor(Math.random() * i);
      arguments[0][index] = arguments[0][index] + Math.random() * 0.1;
    }
    return originalResult;
  };
  exportFunction(getFloatFrequencyData, target.prototype, {defineAs:'getFloatFrequencyData'});
}

createCustomChannelData(window.AudioBuffer);
createCustomChannelData(window.OfflineAudioContext);
createCustomAnalyserNode(window.AnalyserNode);
