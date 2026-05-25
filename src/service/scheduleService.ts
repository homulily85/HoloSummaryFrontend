import { VideoStreamPageSchema } from "../types";
import { apiClient } from "../utils/apiClient";


const getSchedule = async (
    status: "live" | "upcoming" | "past",
    sortBy: string,
    sortOrder: "asc" | "desc",
    pageSize: number = 25,
    pageNumber: number = 0,
) => {
    const response = await apiClient
        .get("/schedule", {
            params: { status, sortBy, sortOrder, pageSize, pageNumber },
        })
        .catch((error: unknown) => {
            console.error(`Error fetching ${status} schedule:`, error);
            return { data: [] };
        });

    return VideoStreamPageSchema.parse(response.data).content || [];
};

export const scheduleService = {
    getSchedule,
};