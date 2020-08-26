import { processBlob } from "../js/wit";
import VoiceRecorder from "../js/voice-recorder";

let port = browser.runtime.connect({ name:"assistant-tab" });

navigator.mediaDevices.getUserMedia({ video: false, audio: true })
    .then(stream => {
        const audioContext = new AudioContext();
        let source = audioContext.createMediaStreamSource(stream);

        const options = {
            source: source,
            voice_start: () => {
                console.log('vad_start');
            },
            voice_stop: (blob) => {
                console.log('vad_stop');

                processBlob(blob)
                    .then(data => sentToBackground('wit-nlp', data));
            }
        };

        new VoiceRecorder(options);

        sentToBackground('recording-started');
    })
    .catch((e) => {
        sentToBackground('recording-permission-denied');

        console.log(e);
    });


function sentToBackground(type, content) {
    port.postMessage({ type: type, content: content });
}
