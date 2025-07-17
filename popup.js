chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.scripting.executeScript({
    target: {tabId: tabs[0].id},
    function: () => {
      const el = [...document.querySelectorAll("*")].find(e => e.textContent.includes("Dikirim dari"));
      const res = el ? el.textContent : "Tidak ditemukan";
      chrome.runtime.sendMessage({uploadDate: res});
    }
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  document.getElementById("result").innerText = msg.uploadDate;
});