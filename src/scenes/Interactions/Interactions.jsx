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

import { useThreadsStats } from "../../hooks/useThreadsStats";
import { fetchMessagesByThreadId } from "../../hooks/fetchMessagesByThreadId";
import { transformMessages } from "../../utils/transformMessages";

export default function Conversaciones({ isConversations = true }) {
  const [selectedThread, setSelectedThread] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messageContainerRef = useRef(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });

  const rowCountRef = useRef(0);
  const [threadsInfo, setThreadsInfo] = useState([]);
  const [messagesWithoutRecomendQuestion, setMessagesWithoutRecomendQuestion] =
    useState([]);

  const { threads, loading: gridLoading } = useThreadsStats();

  useEffect(() => {
    if (!gridLoading && threads.length > 0) {
      setThreadsInfo(threads);
    }
    const sorted = [...threads].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (!selectedThread && sorted[0]) {
      handleSelectedThread(sorted[0].id);
    }
  }, [threads, gridLoading]);

  const handleSelectedThread = async (id) => {
    setSelectedThread(id);
    setIsLoading(true);

    const rawMessages = await fetchMessagesByThreadId(id);
    console.log("🧾 RAW THREAD DATA", rawMessages);

    const uiMessages = transformMessages(rawMessages || []);
    console.log("🧩 Conversación transformada para UI:", uiMessages);

    setMessagesWithoutRecomendQuestion(uiMessages);
    setIsLoading(false);
  };

  const rowSkeletons = useMemo(() => {
    return Array.from({ length: paginationModel.pageSize }, (_, i) => ({
      id: `skeleton-${i}`,
    }));
  }, [paginationModel.pageSize]);

  const columnsDataGrid = useMemo(() => {
    return [
      {
        field: "display_thread_id",
        headerName: "ID",
        align: "center",
        headerAlign: "center",
        width: 100,
        renderCell: (params) => {
          if (String(params.row.id).startsWith("skeleton-")) {
            return (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={"100%"}
                width={"4rem"}
                sx={{ cursor: "pointer" }}
                pl="1rem"
              >
                <Skeleton
                  variant="text"
                  width="60%"
                  height="1.5rem"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                />
              </Box>
            );
          }
          // Es thread real
          return (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={"100%"}
              sx={{ cursor: "pointer" }}
            >
              <CustomChip text={params.value} />
            </Box>
          );
        },
      },
      {
        field: "created_at",
        headerName: "Date",
        flex: 0.2,
        renderCell: (params) => {
          if (String(params.row.id).startsWith("skeleton-")) {
            return (
              <Stack width="100%">
                <Skeleton
                  variant="text"
                  width="40%"
                  height="1.5rem"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height="1.5rem"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                />
              </Stack>
            );
          }
          // Parseamos la fecha
          const [date, time] = params.value.split("T");
          const timeWithoutSeconds = time.split(":").slice(0, 2).join(":");
          const [year, month, day] = date.split("-");
          const formattedDate = `${day}/${month}/${year}`;

          return (
            <Box
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
              height={"100%"}
              width={"fit-content"}
              sx={{ cursor: "pointer" }}
            >
              <Stack spacing={0} sx={{ cursor: "pointer" }}>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    color: colors.gray600,
                  }}
                >
                  {timeWithoutSeconds}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    color: colors.gray600,
                  }}
                >
                  {formattedDate}
                </Typography>
              </Stack>
            </Box>
          );
        },
      },
      {
        field: "language",
        headerName: "Language",
        flex: 0.2,
        renderCell: (params) => {
          if (String(params.row.id).startsWith("skeleton-")) {
            return (
              <Box
                display="flex"
                justifyContent="left"
                alignItems="center"
                height={"100%"}
              >
                <Skeleton
                  variant="text"
                  width="50%"
                  height="1.5rem"
                  sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                />
              </Box>
            );
          }
          return (
            <Box
              sx={{ cursor: "pointer" }}
              display="flex"
              justifyContent="left"
              alignItems="center"
              height={"100%"}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: colors.gray600,
                }}
              >
                {params.value}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "messages_count",
        headerName: "Messages",
        flex: 0.2,
        renderCell: (params) => {
          if (String(params.row.id).startsWith("skeleton-")) {
            return (
              <Box
                display="flex"
                justifyContent="left"
                alignItems="center"
                height={"100%"}
                width={"100%"}
                marginLeft={"1.5rem"}
              >
                <Skeleton
                  variant="text"
                  width="2rem" // Ancho simulado del texto
                  height="1.5rem"
                />
              </Box>
            );
          }
          return (
            <Box
              display="flex"
              justifyContent="left"
              alignItems="center"
              height={"100%"}
              width={"100%"}
              marginLeft={"1.5rem"}
              sx={{ cursor: "pointer" }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  color: colors.gray600,
                }}
              >
                {params.value}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "insights",
        headerName: "Summary",
        flex: 1,
        renderCell: (params) => {
          if (String(params.row.id).startsWith("skeleton-")) {
            // 2 lineas skeleton
            return (
              <Box
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  WebkitLineClamp: 2,
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  padding: "0rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  cursor: "pointer",
                }}
                height={"100%"}
              >
                <Stack width="100%">
                  <Skeleton
                    variant="text"
                    width="100%"
                    height="1.5rem"
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height="1.5rem"
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                  />
                </Stack>
              </Box>
            );
          }
          // thread real
          const resumen =
            params.value?.resumen || "Aún no se ha realizado el resumen";
          return (
            <Box
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 2,
                whiteSpace: "normal",
                wordBreak: "break-word",
                padding: "0rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                cursor: "pointer",
              }}
              height={"100%"}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                  color: colors.gray600,
                }}
              >
                {resumen}
              </Typography>
            </Box>
          );
        },
      },
    ];
  }, [handleSelectedThread]);

  // Seleccionamos filas finales: si estamos cargando en este fetch => skeletons
  const finalRows = useMemo(() => {
    if (gridLoading) return rowSkeletons;

    return [...threads].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  }, [threads, gridLoading, rowSkeletons]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Box sx={{ height: "80vh" }}>
            <DataGrid
              rows={finalRows}
              columns={columnsDataGrid}
              rowHeight={55}
              disableColumnMenu
              hideFooterSelectedRowCount
              paginationMode="server"
              paginationModel={paginationModel}
              rowCount={rowCountRef.current}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              rowSelectionModel={selectedThread ? [selectedThread] : []}
              onRowClick={(params) => handleSelectedThread(params.id)}
              slots={{
                noRowsOverlay: () => (
                  <CustomNoRowsOverlay noRowsText="Aún no hay conversaciones" />
                ),
              }}
              loading={false}
              columnHeaderHeight={60}
              disableColumnResize
              sx={{
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#fafafa",
                },
                "& .Mui-selected": {
                  backgroundColor: "#fafafa !important",
                },
                borderColor: colors.gray300,
                borderRadius: "1rem",
              }}
            />
          </Box>
        </Grid>

        {/* Chat a la derecha (sin cambios) */}
        <Grid item xs={4}>
          {isLoading || gridLoading ? (
            <ConversationSkeleton />
          ) : messagesWithoutRecomendQuestion.length > 0 ? (
            <Box
              height={"100%"}
              maxHeight={"80vh"}
              width={"100%"}
              sx={{
                overflowY: "auto",
                border: `1px solid ${colors.gray300}`,
                borderRadius: "1rem",
              }}
            >
              <MessagesContainer
                messages={messagesWithoutRecomendQuestion}
                messageContainerRef={messageContainerRef}
                isConversaciones={true}
              />
            </Box>
          ) : (
            <Box
              maxHeight={"75vh"}
              height={"75vh"}
              width={"100%"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                border: `1px solid ${colors.gray300}`,
                borderRadius: "1rem",
                color: colors.gray500,
                fontSize: "0.875rem",
                textAlign: "center",
                p: 2,
              }}
            >
              Aún no hay mensajes en esta conversación
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

const CustomNoRowsOverlay = ({ noRowsText = "Aún no hay datos" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "90%",
    }}
  >
    <Typography
      sx={{
        fontSize: "1rem",
        fontFamily: "Inter",
        color: "#000",
      }}
    >
      {noRowsText}
    </Typography>
  </Box>
);
