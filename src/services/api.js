// src/services/api.js
import axios from "axios";

const isProd = window.location.hostname === "byneural.ai";
const BASE_URL = isProd
  ? "https://aeroassistant.test-by-neural.es:446"
  : "/api";

console.log("🧩 BASE_URL:", BASE_URL);

// 1. Crear un nuevo thread
export const createThread = async () => {
  console.log("📡 createThread →", `${BASE_URL}/threads`);
  const res = await axios.post(`${BASE_URL}/threads`);
  console.log("✅ createThread response →", res.data);
  return res.data;
};

// 2. Enviar un mensaje a un thread existente
export const postMessageToThread = async (threadId, content) => {
  console.log("📡 postMessageToThread →", `${BASE_URL}/messages`, {
    threadId,
    content,
  });
  const res = await axios.post(
    `${BASE_URL}/messages`,
    { content },
    { params: { threadId } }
  );
  console.log("✅ postMessageToThread response →", res.data);
  return res.data;
};

// 3. Listar todos los mensajes de un thread
export const fetchMessagesByThreadId = async (threadId) => {
  console.log("📡 fetchMessagesByThreadId →", `${BASE_URL}/messages/list`, {
    threadId,
  });
  const res = await axios.get(`${BASE_URL}/messages/list`, {
    params: { threadId },
  });
  console.log("✅ fetchMessagesByThreadId response →", res.data);
  return res.data;
};

// 4. Consultar el estado/respuesta de un mensaje concreto
export const getMessageStatus = async (threadId, messageId) => {
  console.log("📡 getMessageStatus →", `${BASE_URL}/messages/message`, {
    threadId,
    messageId,
  });
  const res = await axios.get(`${BASE_URL}/messages/message`, {
    params: { threadId, id: messageId },
  });
  console.log("✅ getMessageStatus response →", res.data);
  return res.data;
};
