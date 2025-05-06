export const transformMessages = (rawMessages) => {
  return rawMessages.flatMap((msg) => {
    const userMsg = {
      content_sent: msg.content,
      sent_at: msg.createdAt,
      actions: [],
    };

    const assistantMsg = msg.response
      ? {
          content_received: msg.response,
          sent_at: msg.updatedAt,
          actions: [],
        }
      : null;

    return assistantMsg ? [userMsg, assistantMsg] : [userMsg];
  });
};
