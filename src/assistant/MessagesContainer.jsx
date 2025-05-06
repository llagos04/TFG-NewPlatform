import React, { useEffect, useRef } from "react";
import { Box, Stack } from "@mui/material";
import { TextMessage } from "./TextMessage";
import LoaderFeedback from "./LoaderFeedback";
import { RecommendedQuestions } from "./RecommendedQuestions";
import { FlightInfoList } from "./FlightInfoList";

export const MessagesContainer = ({
  messages,
  sendMessage,
  loading = false,
  streamedResponse = null,
}) => {
  const scrollRef = useRef(null);

  // Derivamos siempre de la prop
  const msgs = (messages || []).map(unifyActions);

  // Auto scroll
  useEffect(() => {
    const c = scrollRef.current;
    if (c) c.scrollTo({ top: c.scrollHeight, behavior: "smooth" });
  }, [msgs, streamedResponse]);

  let assistantIndex = 0;
  const hasResponse = (arr, s) =>
    !!s?.content_received?.trim() ||
    (!!arr.length && !!arr[arr.length - 1].content_received);

  return (
    <Box
      ref={scrollRef}
      sx={{ flexGrow: 1, overflowY: "auto", backgroundColor: "white" }}
    >
      <Box sx={{ m: 2 }}>
        <Stack spacing={1.5}>
          {msgs.map((m, i) => (
            <React.Fragment key={i}>
              {/* Mensaje de usuario */}
              {m.content_sent && (
                <>
                  {(() => {
                    assistantIndex = 0;
                    return null;
                  })()}
                  <TextMessage
                    message={m.content_sent}
                    isUser
                    timestamp={m.sent_at}
                  />
                </>
              )}

              {/* Mensaje del asistente */}
              {m.content_received && (
                <TextMessage
                  message={m.content_received}
                  isUser={false}
                  timestamp={m.sent_at}
                  index={assistantIndex++}
                />
              )}

              {/* Tarjeta de vuelos: SALDRÁ A LA PRIMERA */}
              {m.fetched_info?.flights_by_route && (
                <FlightInfoList
                  flights={JSON.parse(m.fetched_info.flights_by_route)}
                />
              )}
            </React.Fragment>
          ))}

          {/* Streaming parcial */}
          {streamedResponse && (
            <TextMessage
              message={streamedResponse.content_received}
              isUser={false}
              timestamp={streamedResponse.sent_at}
              isStreaming
              index={0}
            />
          )}

          {/* Loader mientras no hay respuesta */}
          {loading && !hasResponse(msgs, streamedResponse) && (
            <Box ml={2} mt={1}>
              <LoaderFeedback />
            </Box>
          )}

          {/* Preguntas recomendadas */}
          {msgs.some((m) =>
            m.actions?.some((a) => a.action_type === "Recomend Question")
          ) && (
            <Box mt={2}>
              {msgs
                .flatMap((m) => m.actions ?? [])
                .filter((a) => a.action_type === "Recomend Question")
                .flatMap((a, qi) =>
                  a.questions.map((q, qj) => (
                    <RecommendedQuestions
                      key={`q-${qi}-${qj}`}
                      questions={[q.question]}
                      onClick={sendMessage}
                    />
                  ))
                )}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

function unifyActions(msg) {
  const custom = [];
  const recs = [];
  (msg.actions ?? []).forEach((a) => {
    if (a.action_type === "Custom Response")
      custom.push({ content_received: a.content_received });
    if (a.action_type === "Recomend Question")
      recs.push({
        question: a.question,
        question_translated: a.question_translated,
      });
  });
  const actions = [];
  if (custom.length)
    actions.push({ action_type: "Custom Response", responses: custom });
  if (recs.length)
    actions.push({ action_type: "Recomend Question", questions: recs });
  return { ...msg, actions };
}
