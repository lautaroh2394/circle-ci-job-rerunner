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
  
document.getElementById('save').addEventListener('click', saveOptions);