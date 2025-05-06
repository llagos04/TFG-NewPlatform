// src/services/api.js
import axios from "axios";

// 1. Crear un nuevo thread
export const createThread = async () => {
  const res = await axios.post("/api/threads");
  console.log("createThread →", res.data);
  return res.data; // { id, createdAt, updatedAt }
};

// 2. Enviar un mensaje a un thread existente
export const postMessageToThread = async (threadId, content) => {
  const res = await axios.post(
    "/api/messages",
    { content },
    { params: { threadId } }
  );
  console.log("postMessageToThread →", res.data);
  return res.data; // respuesta con id, content, threadId, status...
};

// 3. Listar todos los mensajes de un thread
export const fetchMessagesByThreadId = async (threadId) => {
  const res = await axios.get("/api/messages/list", {
    params: { threadId },
  });
  console.log("fetchMessagesByThreadId →", res.data);
  return res.data; // array de mensajes crudos
};

// 4. Consultar el estado/respuesta de un mensaje concreto
export const getMessageStatus = async (threadId, messageId) => {
  const res = await axios.get("/api/messages/message", {
    params: { threadId, id: messageId },
  });
  console.log("getMessageStatus →", res.data);
  return res.data; // objeto con content, response, status…
};
