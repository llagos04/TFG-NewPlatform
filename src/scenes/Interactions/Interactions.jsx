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

export default function Conversaciones({ isConversations = true }) {
  const [refresh, setRefresh] = useState(0);
  const [selectedThread, setSelectedThread] = useState(null);
  const [shouldGetMessages, setShouldGetMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Para el área de chat
  const messageContainerRef = useRef(null);

  // ------------------ Paginación en el Data Grid ------------------
  // MUI usa 0-based para page, mientras que tu backend es 1-based
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });

  // Guardamos el total de hilos disponibles
  const rowCountRef = useRef(0);

  // threadsInfo: datos reales obtenidos de /threads
  const [threadsInfo, setThreadsInfo] = useState([]);

  // Manejo de mensajes (lado derecho)
  const [messagesWithoutRecomendQuestion, setMessagesWithoutRecomendQuestion] =
    useState([]);

  // ------------------------------------------------------------------
  // 1) Llamada al backend para obtener la lista de hilos paginados
  // ------------------------------------------------------------------
  // const fetchThreads = useCallback(async () => {
  //   try {
  //     const url =
  //       `/threads/?tenant_id=${user.selectedTenant.tenant_id}` +
  //       `&page=${paginationModel.page + 1}` + // backend 1-based
  //       `&page_size=${paginationModel.pageSize}`;
  //     const { data } = await apiClient.get(
  //       url,
  //       { opened: true },
  //       { headers: {} }
  //     );

  //     if (data?.results) {
  //       // Guardamos la data real en threadsInfo
  //       const updatedData = data.results.map((item) => ({
  //         ...item,
  //         ID: item.id, // Mantienes la misma key si la usas en otro sitio
  //       }));
  //       setThreadsInfo(updatedData);
  //       handleSelectedThread(data.results[0].id);
  //       // rowCount (el total de hilos)
  //       if (typeof data.count === "number") {
  //         rowCountRef.current = data.count;
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error al obtener los hilos:", err);
  //   }
  // }, [
  //   paginationModel.page,
  //   paginationModel.pageSize,
  //   user.selectedTenant.tenant_id,
  // ]);

  const handleSelectedThread = async (id) => {
    setSelectedThread(id);
    // Verificamos si el thread no está abierto y debemos actualizarlo
    const threadEncontrado = threadsInfo.find((thread) => thread.id === id);
    if (threadEncontrado && !threadEncontrado.opened) {
    }
    setShouldGetMessages(true);
  };

  // const { data: receivedMessages } = getData(
  //   "/messages/?thread_id=" + (selectedThread || 0),
  //   shouldGetMessages && interceptorReady,
  //   null,
  //   refresh
  // );

  const receivedMessages = null;

  // Cuando lleguen los mensajes, procesarlos
  useEffect(() => {
    if (typeof receivedMessages === "undefined") {
      // Aún no han llegado => mantenemos isLoading del chat
      return;
    }

    if (!receivedMessages || !receivedMessages.messages) {
      setMessagesWithoutRecomendQuestion([]);
      setIsLoading(false);
      return;
    }

    // Procesar para quitar "Recomend Question"
    const updatedMessages = receivedMessages.messages.map((message, index) => {
      const updatedActions = message.actions?.filter(
        (action) => action.action_type !== "Recomend Question"
      );
      if (index === 0) {
        const updatedActionsWithoutFirstMessages = updatedActions?.filter(
          (action) => action.action_type !== "Custom Response"
        );
        return { ...message, actions: updatedActionsWithoutFirstMessages };
      }
      return { ...message, actions: updatedActions };
    });

    setMessagesWithoutRecomendQuestion(updatedMessages);
    setIsLoading(false);
  }, [receivedMessages]);

  const rowSkeletons = useMemo(() => {
    return Array.from({ length: paginationModel.pageSize }, (_, i) => ({
      id: `skeleton-${i}`,
    }));
  }, [paginationModel.pageSize]);

  const [gridLoading, setGridLoading] = useState(false);

  // useEffect(() => {
  //   let isMounted = true;
  //   setGridLoading(true);
  //   fetchThreads().finally(() => {
  //     if (isMounted) setGridLoading(false);
  //   });
  //   return () => {
  //     isMounted = false;
  //   };
  // }, [paginationModel.page, paginationModel.pageSize, refresh]);

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
        headerName: "Fecha",
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
                    fontWeight: 600,
                  }}
                >
                  {timeWithoutSeconds}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.75rem",
                    fontWeight: 600,
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
        headerName: "Idioma",
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
                  fontWeight: 600,
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
        headerName: "Mensajes",
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
                  fontSize: "0.75rem",
                  fontWeight: 600,
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
        headerName: "Resumen",
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
                  fontSize: "0.75rem",
                  fontWeight: 600,
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
  const finalRows = gridLoading ? rowSkeletons : threadsInfo;

  // Manejo de la paginación (server side) en Data Grid
  const handlePaginationModelChange = (newModel) => {
    // resetear la página a 0 si cambia el pageSize
    if (newModel.pageSize !== paginationModel.pageSize) {
      newModel.page = 0;
    }
    setPaginationModel(newModel);
  };

  // ------------------------------------------------------------------
  // 7) Render principal: DataGrid (paginado) a la izquierda, chat a la derecha
  // ------------------------------------------------------------------

  return (
    <Box>
      <Grid container spacing={2}>
        {/* ------------------ Tabla de Datos (con paginación) --------------------- */}
        <Grid item xs={8}>
          <Box
            sx={{
              boxSizing: "border-box",
              padding: "0",
              outline: "none",
              width: "100%",
              height: "80vh", // Ajusta a tu gusto
              fontSize: "0.875rem",
              pb: "1rem",
            }}
          >
            <DataGrid
              onRowClick={(params) => handleSelectedThread(params.id)}
              // Filas (reales o skeleton)
              rows={finalRows}
              columns={columnsDataGrid}
              // Ajustes de estilos heredados
              rowHeight={55}
              disableColumnMenu
              hideFooterSelectedRowCount
              // Ahora SÍ usamos footer para la paginación server side
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              rowCount={rowCountRef.current}
              pageSizeOptions={[5, 10, 25, 50, 100]}
              // Slots y overlays
              slots={{
                noRowsOverlay: () => (
                  <CustomNoRowsOverlay noRowsText="Aún no hay conversaciones" />
                ),
              }}
              // Desactivamos el overlay de carga de MUI,
              // pues tenemos skeleton-rows en su lugar
              loading={false}
              columnHeaderHeight={60}
              disableColumnResize
              sx={{
                "& .MuiDataGrid-cell": {
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                },
                "& .MuiDataGrid-cell": {
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 600,
                  fontFamily: "Inter",
                  fontSize: "0.875rem",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#fafafa",
                },
                "& .Mui-selected": {
                  backgroundColor: "#fafafa !important",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#F7F7F8",
                  fontSize: "0.875rem",
                },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#F7F7F8",
                  fontSize: "0.875rem",
                },
                borderColor: colors.gray200,
                borderRadius: "1rem",
              }}
            />
          </Box>
        </Grid>

        {/* ------------------ Ventana de chat (lado derecho) --------------------- */}
        <Grid item xs={4}>
          {isLoading || gridLoading ? (
            // Skeleton del área de chat mientras carga
            <ConversationSkeleton />
          ) : messagesWithoutRecomendQuestion &&
            messagesWithoutRecomendQuestion.length > 0 ? (
            // Muestra el contenedor de mensajes si hay mensajes
            <Box
              maxHeight={"75vh"}
              height={"75vh"}
              width={"100%"}
              sx={{
                overflowY: "auto",
                border: `1px solid ${colors.gray200}`,
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
            // Si no hay mensajes, muestra el texto informativo
            <Box
              maxHeight={"75vh"}
              height={"75vh"}
              width={"100%"}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{
                border: `1px solid ${colors.gray200}`,
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
