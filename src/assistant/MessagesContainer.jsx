import { Box, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { TextMessage } from "./TextMessage";
import LoaderFeedback from "./LoaderFeedback";
import { RecommendedQuestions } from "./RecommendedQuestions";

export const MessagesContainer = ({
  messages,
  sendMessage,
  loading = false,
}) => {
  const messagesContainerRef = useRef(null);
  const [messagesCorrected, setMessagesCorrected] = useState([]);

  useEffect(() => {
    const scrollContainer = messagesContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messagesCorrected]);

  useEffect(() => {
    if (messages) {
      setMessagesCorrected(messages.map((message) => unifyActions(message)));
    }
  }, [messages]);

  return (
    <Box
      ref={messagesContainerRef}
      sx={{
        borderRadius: "0rem 0rem 0.75rem 0.75rem",
        width: "100%",
        boxSizing: "border-box",
        flexGrow: 1,
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        backgroundColor: "white",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          visibility: "hidden",
        },
        "&:hover::-webkit-scrollbar-thumb": {
          visibility: "visible",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
      }}
    >
      <Stack spacing={0.6} sx={{ width: "100%", overflowX: "hidden" }}>
        {messagesCorrected.map((message, index) => (
          <React.Fragment key={index}>
            {message.content_sent && (
              <Box sx={{ maxWidth: "100%", wordBreak: "break-word" }}>
                <TextMessage
                  message={message.content_sent}
                  isUser={true}
                  timestamp={message.sent_at}
                />
              </Box>
            )}
            {message.content_received && (
              <Box sx={{ maxWidth: "100%", wordBreak: "break-word" }}>
                <TextMessage
                  message={message.content_received}
                  isUser={false}
                  timestamp={message.sent_at}
                />
              </Box>
            )}
            {message.actions &&
              message.actions.map((action, idx) => {
                if (action.action_type === "Custom Response") {
                  return action.responses.map((response, rIdx) => (
                    <Box key={`${idx}-${rIdx}`} sx={{ maxWidth: "100%" }}>
                      <TextMessage
                        message={response.content_received}
                        isUser={false}
                      />
                    </Box>
                  ));
                }
                return null;
              })}
          </React.Fragment>
        ))}

        {loading && (
          <Box marginLeft={"1.3rem"} marginTop="0.5rem">
            <LoaderFeedback />
          </Box>
        )}
      </Stack>

      {/* Recomendaciones */}
      {messagesCorrected.some((msg) =>
        msg.actions?.some((a) => a.action_type === "Recomend Question")
      ) && (
        <Box sx={{ mt: 2 }}>
          {messagesCorrected.flatMap((message) =>
            message.actions
              ?.filter((a) => a.action_type === "Recomend Question")
              .map((action, idx) => {
                // construye el array de strings
                const rawQs = action.questions.map((q) => q.question);

                // filtra las vacías
                const questions = rawQs.filter((q) => q && q.trim().length > 0);

                // si tras filtrar no queda nada, omitimos este bloque
                if (questions.length === 0) return null;

                return (
                  <RecommendedQuestions
                    key={idx}
                    questions={questions}
                    onClick={sendMessage}
                  />
                );
              })
          )}
        </Box>
      )}
    </Box>
  );
};

function unifyActions(jsonData) {
  const unifiedActions = [];

  const customResponses = [];
  const recomendQuestions = [];

  if (jsonData.actions && jsonData.actions[0]) {
    jsonData.actions.forEach((action) => {
      if (action?.action_type === "Custom Response") {
        customResponses.push({ content_received: action.content_received });
      }
      if (action?.action_type === "Recomend Question") {
        recomendQuestions.push({
          question: action.question,
          question_translated: action.question_translated || null,
        });
      }
    });
  }

  if (customResponses.length > 0) {
    unifiedActions.push({
      action_type: "Custom Response",
      responses: customResponses,
    });
  }

  if (recomendQuestions.length > 0) {
    unifiedActions.push({
      action_type: "Recomend Question",
      questions: recomendQuestions,
    });
  }

  return {
    ...jsonData,
    actions: unifiedActions,
  };
}
