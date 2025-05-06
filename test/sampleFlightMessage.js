// test/sampleFlightResponse.js
export const sampleFlightMessage = {
  id: 81,
  content: "yes, it's correct",
  order: 2,
  response:
    "Thank you for confirming. Here are the details for flights from Atlanta Hartsfield-Jackson International Airport (KATL) to Barcelona (BCN) tomorrow:\n\n...",
  status: "COMPLETED",
  fetched_info: {
    flights_by_route: `[
        {
          "flightNumber": "194",
          "airline": "DL",
          "status": "Scheduled",
          "aircraft": "A359",
          "origin": {
            "code": "ATL",
            "terminal": "I",
            "gate": null,
            "scheduled": "10:45:00 PM",
            "actual": "N/A",
            "delay": 0
          },
          "destination": {
            "code": "BCN",
            "terminal": null,
            "gate": "TBA",
            "scheduled": "7:20:00 AM",
            "actual": "N/A",
            "delay": -1020
          }
        },
        {
          "flightNumber": "270",
          "airline": "DL",
          "status": "Scheduled",
          "aircraft": "A339",
          "origin": {
            "code": "ATL",
            "terminal": "I",
            "gate": null,
            "scheduled": "8:30:00 PM",
            "actual": "N/A",
            "delay": 0
          },
          "destination": {
            "code": "BCN",
            "terminal": "1",
            "gate": null,
            "scheduled": "5:15:00 AM",
            "actual": "N/A",
            "delay": 0
          }
        },
        {
          "flightNumber": "270",
          "airline": "DL",
          "status": "Scheduled",
          "aircraft": "A339",
          "origin": {
            "code": "ATL",
            "terminal": "I",
            "gate": null,
            "scheduled": "8:30:00 PM",
            "actual": "N/A",
            "delay": 0
          },
          "destination": {
            "code": "BCN",
            "terminal": "1",
            "gate": null,
            "scheduled": "5:15:00 AM",
            "actual": "N/A",
            "delay": 0
          }
        }
      ]`,
  },
  createdAt: "2025-05-06T17:13:46.000Z",
  updatedAt: "2025-05-06T17:13:53.000Z",
  threadId: 49,
};
