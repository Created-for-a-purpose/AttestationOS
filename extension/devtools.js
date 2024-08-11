let retrieved = false;

const AUTH_TOKEN = 'auth_token'

const data = {
  [AUTH_TOKEN]: ''
}

const preprocess = (obj) => {
  if (obj === null || obj === undefined) {
    data[AUTH_TOKEN] = 'failed'
    return
  }

  for (const entry of obj) {
    // Check if the entry has a request object with headers
    if (entry.request && entry.request.headers) {
      // Iterate through the headers array
      for (const header of entry.request.cookies) {
        // Check if the header name is 'x-csrf-token'
        if (header.name === AUTH_TOKEN)
          data[AUTH_TOKEN] = header.value
      }
    }
  }
}

chrome.devtools.inspectedWindow.eval("window.location.href", function (result, isException) {
  if (!isException && result.startsWith('https://x.com/')) {
    chrome.devtools.network.getHAR(function (request) {
      if (retrieved) return;
      retrieved = true;

      alert('AttestationOS will load your network HAR now..')
      preprocess(request.entries)
      chrome.runtime.sendMessage({ messageFromDevTools: data })
      alert('Done! You can close DevTools now.')
    })
  }
})