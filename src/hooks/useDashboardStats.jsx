import { useEffect, useState } from "react";
import axios from "axios";

export const useDashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/monitoring/stats");

      const data = response.data;

      const parsedStats = {
        total_messages: [data.totalMessages ?? 0, null],
        total_threads: [data.totalThreads ?? 0, null],
        messages_per_thread: [
          Number((data.messagesPerConversation ?? 0).toFixed(2)),
          null,
        ],

        aprox_time_saved: [
          `${Math.floor((data.timeSavedMinutes ?? 0) / 60)}:${
            (data.timeSavedMinutes ?? 0) % 60
          }`,
          null,
        ],
        leads_data: [0, null],
        languages: {},
        success: [null, null],
      };

      setStats(parsedStats);
    } catch (err) {
      console.error("Error al obtener estadísticas del dashboard", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};
