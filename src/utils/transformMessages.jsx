export const transformMessages = (rawMessages) => {
  const flat = rawMessages.flatMap((msg) => {
    const userMsg = {
      content_sent: msg.content,
      sent_at: msg.createdAt,
      actions: msg.actions,
    };
    const assistantMsg = msg.response
      ? {
          content_received: msg.response,
          sent_at: msg.updatedAt,
          actions: msg.actions,
          processing: msg.processing, // 👈 Mantén todo intacto
        }
      : null;
    return assistantMsg ? [userMsg, assistantMsg] : [userMsg];
  });

  console.log("── transformMessages output:", flat);
  return flat;
};
