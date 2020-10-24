const backgroundPage = browser.extension.getBackgroundPage();

function saveCheckbox(e) {
  e.preventDefault();
  backgroundPage.set({
    [e.target.id]: e.target.checked
  });
}

function initCheckbox(object, value, defaultValue) {
  object.addEventListener('change', saveCheckbox);
  object.checked = value || defaultValue;
}

function saveTextArea(e) {
  e.preventDefault();
  backgroundPage.set({
    [e.target.id]: e.target.value
  });
}

function initTextArea(object, value, defaultValue) {
  object.addEventListener('input', saveTextArea);
  object.value = value || defaultValue;
}

// FIXME: For now, every input is a checkbox but we'll later need to match on
// type too
function initByTagName(object, value, defaultValue) {
  const match = {
    "INPUT": initCheckbox,
    "TEXTAREA": initTextArea,
  }
  return match[object.tagName](object, value, defaultValue)
}

function restoreOptions() {
  for ([key, defaultValue] of Object.entries(backgroundPage.defaultValues)) {
    let component = document.getElementById(key);
    if (!component) {
      console.log(`AudioContext-Scrambler: ${key} component does not exists`);
      return;
    }
    initByTagName(component, backgroundPage.get(key), defaultValue)
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
