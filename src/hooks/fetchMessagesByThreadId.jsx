import axios from "axios";

export const fetchMessagesByThreadId = async (threadId) => {
  try {
    const response = await axios.get(`/api/messages/list`, {
      params: { threadId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
