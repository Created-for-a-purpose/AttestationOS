console.log('AttestationOS frontend loaded!');

let DATA = {}

const AUTH_TOKEN = 'auth_token'

chrome.runtime.sendMessage({ messageFromContent: 'Extension ready' })

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request && request.messageFromBackground) {
        const status = request.messageFromBackground === 'true' ? `You're on X!` : 'Please navigate to x.com!!';
        document.getElementById('status').textContent = status;
        if (status === `You're on X!`) {
            document.getElementById('status').style.color = 'lightgreen';
            document.getElementById('innerContent').innerHTML = `<p>🛜 Capturing network traffic...</p>
            <p><b>Auth token:</b>
            <span id="auth">Please open DevTools🔃</span>
            </p>`;
        }
    }
    else if (request.dataFromBackground) {
        const data = request.dataFromBackground;
        const wallet = new ethers.Wallet('cde2be96e27d483b8b1bf45b68d5b721d891371689c358f2d1497054c07609b4')
        const access_token = data[AUTH_TOKEN];
        const timestamp = Date.now();
        const token_hash = ethers.keccak256(ethers.toUtf8Bytes(access_token + timestamp));
        const signature = await wallet.signMessage(token_hash);
        DATA = {
            access_token,
            timestamp,
            signature
        }
        document.getElementById('auth').textContent = access_token.slice(0, 4) + '...' + access_token.slice(-4);
    }
})

document.getElementById('downloadButton').addEventListener('click', async () => {
    const jsonData = JSON.stringify(DATA);
    const fileurl = `data:application/json,${encodeURIComponent(jsonData)}`;
    const filename = 'proof.json';
    chrome.downloads.download({ url: fileurl, filename })
    document.getElementById('innerContent').innerHTML = `<p>✅ Downloaded!</p>`;
})