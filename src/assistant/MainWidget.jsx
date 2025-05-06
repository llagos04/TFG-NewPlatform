import React, { useState, useEffect } from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import {
  createThread,
  postMessageToThread,
  fetchMessagesByThreadId,
  getMessageStatus,
} from "../services/api";

import { sampleFlightMessage } from "../../test/sampleFlightMessage";
import { te } from "date-fns/locale";

// Helper para pausar la ejecución un número de milisegundos
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const welcomeMessages = [
  {
    id: "0",
    content: null,
    response: "Hola",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    threadId: null,
  },
  {
    id: "welcome2",
    content: null,
    response: "¿En que puedo ayudarte?",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    threadId: null,
  },
];

export const MainWidget = () => {
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState(() => {
    return localStorage.getItem("chat_thread_id") || null;
  });

  const [rawMessages, setRawMessages] = useState(() => {
    const saved = localStorage.getItem("chat_raw_messages");
    const parsed = saved ? JSON.parse(saved) : [];
    // Si ya tenemos guardados mensajes de bienvenida, no los dupliques
    const hasWelcome = parsed.some((m) => m.id === "0");
    return hasWelcome ? parsed : [...welcomeMessages, ...parsed];
  });

  const [loading, setLoading] = useState(false);

  const [streamedResponse, setStreamedResponse] = useState(null);

  const [justCreatedThread, setJustCreatedThread] = useState(false);

  // Cada vez que tengamos un threadId, cargamos su historial
  useEffect(() => {
    if (!threadId || justCreatedThread) return;

    setLoading(true);
    fetchMessagesByThreadId(threadId)
      .then((msgs) => {
        // Definimos aquí los mensajes de bienvenida
        const welcomeMessages = [
          {
            id: "0",
            content: null,
            response: "Hola",
            status: "COMPLETED",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            threadId: threadId,
          },
          {
            id: "welcome2",
            content: null,
            response: "¿En qué puedo ayudarte?",
            status: "COMPLETED",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            threadId: threadId,
          },
        ];

        // Solo los añadimos si no vienen ya en la respuesta
        const hasWelcome = msgs.some((m) => m.id === "0");
        const combined = hasWelcome ? msgs : [...welcomeMessages, ...msgs];

        setRawMessages(combined);
      })
      .catch((err) => {
        console.error("fetchMessages error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [threadId, justCreatedThread]);

  // Función para limpiar el chat -> Falta implementar al reiniciar
  const clearConversation = () => {
    localStorage.removeItem("chat_thread_id");
    localStorage.removeItem("chat_raw_messages");
    setThreadId(null);
    setRawMessages([]);
  };

  useEffect(() => {
    if (open && !threadId && rawMessages.length === 0) {
      setRawMessages(welcomeMessages);
    }
  }, [open, threadId, rawMessages]);

  useEffect(() => {
    if (threadId) {
      localStorage.setItem("chat_thread_id", threadId);
    }
  }, [threadId]);

  useEffect(() => {
    if (rawMessages.length > 0) {
      localStorage.setItem("chat_raw_messages", JSON.stringify(rawMessages));
    }
  }, [rawMessages]);

  const sendMessage = async (content) => {
    // Crear mensaje temporal sin ID (id = 'temp')
    const tempId = "temp_" + Date.now();
    const tempUserMessage = {
      id: tempId,
      content: content,
      response: null,
      status: "SENT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      threadId: threadId ?? "temp",
    };

    setRawMessages((prev) => [...prev, tempUserMessage]);

    setLoading(true);
    setStreamedResponse(null);

    try {
      let currentThreadId = threadId;

      if (!currentThreadId) {
        const newThread = await createThread();
        currentThreadId = newThread.id;
        setThreadId(currentThreadId);
        setJustCreatedThread(true);
      }

      const sent = await postMessageToThread(currentThreadId, content);

      // Reemplazar el mensaje temporal por el real (mismo contenido, con ID)
      setRawMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                id: sent.id,
                status: "LOADING",
                threadId: currentThreadId,
              }
            : msg
        )
      );

      // Polling
      let statusObj;
      let firstStreamReceived = false;

      do {
        await sleep(100);
        statusObj = await getMessageStatus(currentThreadId, sent.id);
        console.log("Polled status:", statusObj);

        if (statusObj.status === "STREAMING" && statusObj.response) {
          if (!firstStreamReceived && statusObj.response.trim() !== "") {
            setLoading(false);
            firstStreamReceived = true;
          }

          setRawMessages((prev) =>
            prev.map((msg) =>
              msg.id === sent.id
                ? {
                    ...msg,
                    response: statusObj.response,
                    updatedAt: statusObj.updatedAt,
                  }
                : msg
            )
          );
        }
      } while (
        statusObj.status === "LOADING" ||
        statusObj.status === "STREAMING"
      );

      // Finalizar mensaje
      setStreamedResponse(null);
      setRawMessages((prev) =>
        prev.map((msg) =>
          msg.id === sent.id
            ? {
                ...msg,
                fetched_info: statusObj.fetched_info,
                response: statusObj.response,
                status: statusObj.status,
                updatedAt: statusObj.updatedAt,
              }
            : msg
        )
      );
    } catch (err) {
      console.error("sendMessage error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <>
      <ChatButton onClick={toggleOpen} isOpen={open} />
      <ChatWindow
        visible={open}
        setOpen={() => setOpen(false)}
        messages={rawMessages}
        sendMessage={sendMessage}
        loading={loading}
        streamedResponse={streamedResponse}
        clearConversation={clearConversation}
      />
    </>
  );
};
