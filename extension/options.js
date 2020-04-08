const backgroundPage = browser.extension.getBackgroundPage();

function saveCheckbox(e) {
  e.preventDefault();
  backgroundPage.set({
    [e.target.id]: e.target.checked
  });
}

function restoreOptions() {
  for ([key, defaultValue] of Object.entries(backgroundPage.defaultValues)) {
    let checkbox = document.getElementById(key);
    if (!checkbox) {
      console.log(`AudioContext-Scrambler: ${key} checkbox does not exists`);
      return;
    }
    let result = backgroundPage.get(key);
    checkbox.addEventListener('change', saveCheckbox);
    checkbox.checked = result || defaultValue;
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
