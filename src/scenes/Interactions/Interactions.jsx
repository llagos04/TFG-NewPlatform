import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { DataGrid } from "@mui/x-data-grid";
import colors from "../../styles/colors";
import { ConversationSkeleton } from "./ConversationSkeleton";
import { MessagesContainer } from "../../assistant/MessagesContainer";
import { CustomChip } from "../../components/CustomChip";

const TENANT_ID = 1; // Cambiar si es necesario

export default function Interactions() {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const [threadsInfo, setThreadsInfo] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingGrid, setLoadingGrid] = useState(true);
  const rowCountRef = useRef(0);
  const messageContainerRef = useRef(null);

  const fetchThreads = useCallback(async () => {
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/threads/?tenant_id=${TENANT_ID}&page=${
          paginationModel.page + 1
        }&page_size=${paginationModel.pageSize}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setThreadsInfo(data.results || []);
      rowCountRef.current = data.count || 0;
      if (data.results?.[0]) handleSelectThread(data.results[0].id);
    } catch (err) {
      console.error("Error al cargar hilos:", err);
    } finally {
      setLoadingGrid(false);
    }
  }, [paginationModel]);

  const handleSelectThread = async (id) => {
    setSelectedThread(id);
    setLoadingMessages(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/messages/?thread_id=${id}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      const cleanMessages = (data.messages || []).map((msg, idx) => {
        const filtered =
          msg.actions?.filter((a) => a.action_type !== "Recomend Question") ||
          [];
        return {
          ...msg,
          actions:
            idx === 0
              ? filtered.filter((a) => a.action_type !== "Custom Response")
              : filtered,
        };
      });
      setMessages(cleanMessages);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [paginationModel]);

  const skeletonRows = useMemo(
    () =>
      Array.from({ length: paginationModel.pageSize }, (_, i) => ({
        id: `skeleton-${i}`,
      })),
    [paginationModel.pageSize]
  );

  const columns = useMemo(
    () => [
      {
        field: "display_thread_id",
        headerName: "ID",
        width: 100,
        renderCell: ({ row }) =>
          row.id?.toString().startsWith("skeleton") ? (
            <Skeleton width="60%" />
          ) : (
            <CustomChip text={row.display_thread_id} />
          ),
      },
      {
        field: "created_at",
        headerName: "Fecha",
        flex: 0.2,
        renderCell: ({ value, row }) => {
          if (row.id?.toString().startsWith("skeleton"))
            return <Skeleton width="80%" />;
          const [date, time] = value.split("T");
          const [y, m, d] = date.split("-");
          return (
            <Stack>
              <Typography>{`${d}/${m}/${y}`}</Typography>
              <Typography fontSize={12}>{time.slice(0, 5)}</Typography>
            </Stack>
          );
        },
      },
      {
        field: "language",
        headerName: "Idioma",
        flex: 0.2,
        renderCell: ({ value, row }) =>
          row.id?.toString().startsWith("skeleton") ? (
            <Skeleton width="50%" />
          ) : (
            <Typography>{value}</Typography>
          ),
      },
      {
        field: "messages_count",
        headerName: "Mensajes",
        flex: 0.2,
        renderCell: ({ value, row }) =>
          row.id?.toString().startsWith("skeleton") ? (
            <Skeleton width="30%" />
          ) : (
            <Typography>{value}</Typography>
          ),
      },
      {
        field: "insights",
        headerName: "Resumen",
        flex: 1,
        renderCell: ({ value, row }) => {
          if (row.id?.toString().startsWith("skeleton"))
            return <Skeleton width="100%" />;
          const resumen = value?.resumen || "Aún no se ha realizado el resumen";
          return <Typography noWrap>{resumen}</Typography>;
        },
      },
    ],
    []
  );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <DataGrid
            onRowClick={(params) => handleSelectThread(params.id)}
            rows={loadingGrid ? skeletonRows : threadsInfo}
            columns={columns}
            rowHeight={55}
            pageSizeOptions={[5, 10, 50, 100]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            paginationMode="server"
            rowCount={rowCountRef.current}
            sx={{ borderRadius: 2, borderColor: colors.gray200 }}
          />
        </Grid>

        <Grid item xs={4}>
          {loadingMessages ? (
            <ConversationSkeleton />
          ) : messages.length > 0 ? (
            <Box
              height="75vh"
              sx={{
                overflowY: "auto",
                border: `1px solid ${colors.gray200}`,
                borderRadius: 2,
              }}
            >
              <MessagesContainer
                messages={messages}
                messageContainerRef={messageContainerRef}
              />
            </Box>
          ) : (
            <Box
              height="75vh"
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{ border: `1px solid ${colors.gray200}`, borderRadius: 2 }}
            >
              <Typography>Aún no hay mensajes en esta conversación</Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
