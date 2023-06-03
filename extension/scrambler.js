const cache = new Map()
function isScrambled(object, channelNumber) {
  if (!cache.has(object)) {
    cache.set(object, new Map());
  }

  objectMap = cache.get(object);
  return objectMap.has(channelNumber);
}

function markScrambled(object, channelNumber) {
  if (!cache.has(object)) {
    cache.set(object, new Map());
  }

  objectMap = cache.get(object);
  return objectMap.set(channelNumber, true);
}

function createCustomChannelData(target) {
  const originalGetChannelData = target.prototype.getChannelData;
  const originalCopyFromChannel = target.prototype.copyFromChannel;

  let getChannelData = function () {
    const originalResult = originalGetChannelData.apply(this, arguments);
    const channelNumber = arguments[0];
    if (!isScrambled(this, channelNumber)) {
      browser.runtime.sendMessage({content: window.top.location.href});
      for (var i = 0; i < originalResult.length; i += 100) {
        let index = Math.floor(Math.random() * i);
        originalResult[index] = originalResult[index] + Math.random() * 0.0000001;
      }
      markScrambled(this, channelNumber);
    }

    return originalResult;
  };

  let copyFromChannel = function () {
    if (arguments.length < 2) {
      throw new TypeError('AudioBuffer.copyFromChannel: At least 2 arguments required, but only ' + arguments.length + ' passed');
    }
    if (!isScrambled(this, arguments[1])) {
      /* Force scrambler to run */
      getChannelData.apply(this, [arguments[1]])
    }
    return originalCopyFromChannel.apply(this, arguments);
  }

  exportFunction(getChannelData, target.prototype, {defineAs:'getChannelData'});
  exportFunction(copyFromChannel, target.prototype, {defineAs:'copyFromChannel'});
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
