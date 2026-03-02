import { EventsApi, GetEventResponse } from "kalshi-typescript";
import { ServiceError } from "../utils/errors";

const apiInstance = new EventsApi();

export async function getKalshiEvent(
  eventTicker: string
): Promise<GetEventResponse> {
  try {
    const response = await apiInstance.getEvent(eventTicker, false);

    if (response.status !== 200) {
      throw new ServiceError(
        "Kalshi API error",
        response.status,
        response.statusText
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof ServiceError) throw error;
    throw new ServiceError("Failed to fetch Kalshi event");
  }
}
