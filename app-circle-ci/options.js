// Saves options to chrome.storage
function saveOptions() {
    var token = document.getElementById('personal-api-token').value;
    chrome.storage.sync.set({
      token,
    }, function() {
      // Update status to let user know options were saved.
      let status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Lets the use know if there is a token configured
  function restoreOptions() {
    chrome.storage.sync.get("personal-api-token", function(items) {
        let status = document.getElementById('status');
        status.textContent = 'A token is already saved';
    });
  }
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click',
      saveOptions);