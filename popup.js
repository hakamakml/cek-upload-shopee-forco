document.getElementById("trigger").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        const event = new Event("load");
        window.dispatchEvent(event);
      }
    });
  });
});