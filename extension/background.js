defaultValues = {
  enableNotification: false
}

function get(key) {
  return options[key];
}

async function set(obj) {
  // FIXME: missing error handling
  options = Object.assign({}, options, obj);
  return browser.storage.sync.set(obj);
}

function loadOptions() {
  let storePromise = browser.storage.sync.get(defaultValues);
  storePromise.then((res, err) => {
    options = res;
  });
}

let options = defaultValues;
loadOptions();

browser.runtime.onMessage.addListener((message) => {
  if (options.enableNotification) {
    browser.notifications.create({
      type: "basic",
      title: "Fingerprint Detected",
      message: `On ${message.content}`
    });
  }
});
