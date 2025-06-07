// utils/audioTranscriber.js

export function createAudioRecorder() {
  let mediaRecorder;
  let stream;
  let audioChunks = [];

  return {
    async start() {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      audioChunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      mediaRecorder.start();
    },
    async stop() {
      return new Promise((resolve, reject) => {
        if (!mediaRecorder) return reject(new Error("No se está grabando"));
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          const blob = new Blob(audioChunks, { type: "audio/webm" });
          resolve(blob);
        };
        mediaRecorder.stop();
      });
    }
  };
}

export const transcribeAudio = async (blob) => {
  const form = new FormData();
  form.append("audio", blob, "recording.webm");
  const resp = await fetch("/api/audio/transcribe", {
  method: "POST",
  body: form,
});

  if (!resp.ok) throw new Error("Error al transcribir audio");
  const data = await resp.json();
  return data.text;
};
