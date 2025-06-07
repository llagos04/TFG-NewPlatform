import React, { useState, useEffect } from "react";
import { ChatButton } from "./ChatButton";
import { ChatWindow } from "./ChatWindow";
import {
  createThread,
  postMessageToThread,
  fetchMessagesByThreadId,
  getMessageStatus,
} from "../services/api";

import { useIsMobile } from "../hooks/useIsMobile";

// Helper para pausar la ejecución un número de milisegundos
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const MainWidget = () => {
  const [open, setOpen] = useState(false);
  const [threadId, setThreadId] = useState(() => {
    return localStorage.getItem("chat_thread_id") || null;
  });

  const isMobile = useIsMobile(425);

  const detectLanguage = () => {
    const lang = navigator.language.toLowerCase(); // ej: "es-ES"
    if (lang.startsWith("es")) return "ES";
    if (lang.startsWith("it")) return "IT";
    if (lang.startsWith("fr")) return "FR";
    if (lang.startsWith("en")) return "EN";
    if (lang.startsWith("ca")) return "CA";
    if (lang.startsWith("de")) return "DE";
    return "EN"; // Por defecto
  };

  const [language, setLanguage] = useState(detectLanguage());

  const [rawMessages, setRawMessages] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("chat_raw_messages");
    const parsed = saved ? JSON.parse(saved) : [];
    const hasWelcome = parsed.some((m) => m.id === "0");

    const enhanced = parsed.map((m) =>
      injectRecommendedQuestionsIfMissing(m, language)
    );

    const initialMessages = hasWelcome
      ? enhanced
      : [...getWelcomeMessages(), ...enhanced];

    setRawMessages(initialMessages);
  }, [language]);

  const welcomeMessagesMap = {
    EN: "Hi! 👋🏻 What can I do for you?",
    ES: "¡Hola! 👋🏻 ¿En qué puedo ayudarte?",
    FR: "Salut ! 👋🏻 Que puis-je faire pour vous ?",
    IT: "Ciao! 👋🏻 Come posso aiutarti?",
    CA: "Hola! 👋🏻 Com puc ajudar-te?",
    DE: "Hallo! 👋🏻 Wie kann ich dir helfen?",
  };

  const getWelcomeMessages = () => [
    {
      id: "0",
      content: null,
      response: welcomeMessagesMap[language] || welcomeMessagesMap["EN"],
      status: "COMPLETED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      threadId: null,
    },
  ];

  const translatedQuestionsMap = {
    EN: [
      "Concourse F",
      "Concourse T",
      "Domestic Terminal",
      "Concourse C",
      "Concourse D",
      "Concourse E",
      "Concourse A",
      "Concourse B",
    ],
    ES: [
      "Sala F",
      "Sala T",
      "Terminal Doméstica",
      "Sala C",
      "Sala D",
      "Sala E",
      "Sala A",
      "Sala B",
    ],
    FR: [
      "Hall F",
      "Hall T",
      "Terminal Domestique",
      "Hall C",
      "Hall D",
      "Hall E",
      "Hall A",
      "Hall B",
    ],
    IT: [
      "Concorso F",
      "Concorso T",
      "Terminal Domestico",
      "Concorso C",
      "Concorso D",
      "Concorso E",
      "Concorso A",
      "Concorso B",
    ],
    CA: [
      "Sala F",
      "Sala T",
      "Terminal Domèstica",
      "Sala C",
      "Sala D",
      "Sala E",
      "Sala A",
      "Sala B",
    ],
    DE: [
      "Concourse F",
      "Concourse T",
      "Inlandsterminal",
      "Concourse C",
      "Concourse D",
      "Concourse E",
      "Concourse A",
      "Concourse B",
    ],
  };

  const injectRecommendedQuestionsIfMissing = (msg, language) => {
    const step1 = msg.processing?.["Step 1"];
    const missing = step1?.missing_information;
    const category = step1?.required_info?.includes(
      "services and general info"
    );

    if (missing && category) {
      const baseQuestions = translatedQuestionsMap["EN"];
      const translated = translatedQuestionsMap[language] || baseQuestions;

      return {
        ...msg,
        actions: [
          ...(msg.actions || []),
          {
            action_type: "Recomend Question",
            questions: baseQuestions.map((q, i) => ({
              question: q,
              question_translated: translated[i] || q,
            })),
          },
        ],
      };
    }

    return msg;
  };

  useEffect(() => {
    setRawMessages((prev) =>
      prev.map((m) => injectRecommendedQuestionsIfMissing(m, language))
    );
  }, [language]);

  const [loading, setLoading] = useState(false);

  const [streamedResponse, setStreamedResponse] = useState(null);

  const [justCreatedThread, setJustCreatedThread] = useState(false);

  // Cada vez que tengamos un threadId, cargamos su historial
  useEffect(() => {
    if (!threadId || justCreatedThread) return;

    setLoading(true);
    fetchMessagesByThreadId(threadId)
      .then((msgs) => {
        const welcome = getWelcomeMessages().map((m) => ({
          ...m,
          threadId,
        }));
        const hasWelcome = msgs.some((m) => m.id === "0");

        const enhanced = msgs.map((m) =>
          injectRecommendedQuestionsIfMissing(m, language)
        );

        const combined = hasWelcome ? enhanced : [...welcome, ...enhanced];
        setRawMessages(combined);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [threadId, justCreatedThread, language]); // ✅ language aquí

  // Función para limpiar el chat -> Falta implementar al reiniciar
  const clearConversation = () => {
    localStorage.removeItem("chat_thread_id");
    localStorage.removeItem("chat_raw_messages");
    setThreadId(null);
    setRawMessages([]);
  };

  useEffect(() => {
    if (open && !threadId && rawMessages.length === 0) {
      setRawMessages(getWelcomeMessages());
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

    setRawMessages((prev) => {
      // Eliminamos preguntas recomendadas del último mensaje del asistente
      const updated = [...prev];
      for (let i = updated.length - 1; i >= 0; i--) {
        const msg = updated[i];
        if (msg.response && msg.actions) {
          updated[i] = {
            ...msg,
            actions: msg.actions.filter(
              (a) => a.action_type !== "Recomend Question"
            ),
          };
          break;
        }
      }

      // Añadimos el nuevo mensaje del usuario
      return [...updated, tempUserMessage];
    });

    setLoading(true);
    setStreamedResponse(null);

    try {
      let currentThreadId = threadId;

      if (!currentThreadId) {
        const newThread = await createThread(language);
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
            ? injectRecommendedQuestionsIfMissing(
                {
                  ...msg,
                  response: statusObj.response,
                  status: statusObj.status,
                  updatedAt: statusObj.updatedAt,
                  processing: statusObj.processing,
                },
                language
              )
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
      <ChatButton onClick={toggleOpen} isOpen={open} isMobile={isMobile} />
      <ChatWindow
        visible={open}
        setOpen={() => setOpen(false)}
        messages={rawMessages}
        sendMessage={sendMessage}
        loading={loading}
        streamedResponse={streamedResponse}
        clearConversation={clearConversation}
        isMobile={isMobile}
        language={language}
        setLanguage={setLanguage}
      />
    </>
  );
};
