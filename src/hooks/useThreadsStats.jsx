import { useEffect, useState } from "react";
import axios from "axios";

export const useThreadsStats = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatFecha = (fechaStr) => {
    // Convierte de "6/5/2025" a "2025-05-06"
    const [day, month, year] = fechaStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const fetchThreads = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/monitoring/threads-stats/");

      const data = response.data;

      // Si el backend responde con un error en JSON
      if (data.error) {
        throw new Error(data.error);
      }

      // Mapeo si todo va bien
      const mappedThreads = data.map((thread) => ({
        id: thread.threadId,
        display_thread_id: thread.threadId,
        messages_count: thread.totalMessages,
        language: "-", // Placeholder
        created_at: `${formatFecha(thread.lastMessageDate)}T${
          thread.lastMessageTime
        }`,
        insights: {
          resumen: thread.parameterExtractions?.length
            ? `${thread.parameterExtractions.length} extracted parameters`
            : "No summary available",
        },
      }));

      setThreads(mappedThreads);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return { threads, loading, error, refetch: fetchThreads };
};
