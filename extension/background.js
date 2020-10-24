defaultValues = {
  enableNotification: false,
  allowlist: ""
}

let options = defaultValues;

function get(key) {
  return options[key];
}

async function set(obj) {
  // FIXME: missing error handling
  options = Object.assign({}, options, obj);
  return browser.storage.sync.set(obj);
}

function loadOptions(onLoaded) {
  let storePromise = browser.storage.sync.get(defaultValues);
  storePromise.then((res, err) => {
    options = res;
    onLoaded();
  });
}

function injectContentScript(details) {
  if (options.allowlist.split('\n').some(pattern => pattern.trim() !== "" && new RegExp(pattern).test(details.documentUrl))) {
    return;
  }

  let injectDetails = {
    file: "/scrambler.js",
    frameId: details.frameId
  };

  browser.tabs.executeScript(details.tabId, injectDetails);
}

function onDefaultsLoaded() {
  filter = {
    urls: ['*://*/*'],
  };
  browser.webRequest.onBeforeRequest.addListener(
    injectContentScript,
    filter
  );
}

loadOptions(onDefaultsLoaded);

browser.runtime.onMessage.addListener((message) => {
  if (options.enableNotification) {
    browser.notifications.create({
      type: "basic",
      title: "Fingerprint Detected",
      message: `On ${message.content}`
    });
  }
});
