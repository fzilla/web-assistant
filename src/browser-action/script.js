let port = browser.runtime.connect({ name: "browser-action" });
let history = [];

let startBtn = document.getElementById('start-btn');
let stopBtn = document.getElementById('stop-btn');

startBtn.addEventListener('click', e => {
	e.preventDefault();
    port.postMessage({ type: 'assistant-start' });
});

stopBtn.addEventListener('click', e => {
	e.preventDefault();
    port.postMessage({ type: 'assistant-stop' });
});

port.onMessage.addListener(message => {
    if (message['type'] === 'executed-command') {
        addHistory(message['command']);
    }
    else if (message['type'] === 'assistant-status') {
        setStatus(message['status'], message['statusText']);
    }
    else if (message['type'] === 'set-session') {
        setStatus(message['session']['status'], message['session']['statusText']);
        history = message['session']['history'];
        renderHistory();
        setActiveStatus(message['session']['activeStatus']);
    }
});

document.getElementById('emulator-form').addEventListener('submit', e => {
    e.preventDefault();

    let text = document.getElementById('emulator-input').value;
    if (text) {
        port.postMessage({ type: 'emulate-command', command: text })
    }
    document.getElementById('emulator-input').value = '';
});

function setActiveStatus(status) {
    if (status) {
        stopBtn.classList.remove('hidden');
        startBtn.classList.add('hidden');
    }
    else {
        stopBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
    }
}

function setStatus(status, text) {
    if (status === 'assistant-active') {
        setActiveStatus(true);
    }
    else if (status === 'assistant-inactive') {
        setActiveStatus(false);
    }

    document.getElementById('status-text').innerText = text;
}

function addHistory(command) {
    history.push(command);

    if (history.length > 5) {
        history.shift();
    }

    renderHistory();
}

function renderHistory() {
    const hist = document.getElementById('history');
    let histHTML = [];

    history.forEach(v => {
    	const p = document.createElement('p');
    	p.classList.add('item');
    	p.innerText = v;

        histHTML.push(p);
    });

	while(hist.firstChild && hist.removeChild(hist.firstChild));
    hist.append(...histHTML);
}
