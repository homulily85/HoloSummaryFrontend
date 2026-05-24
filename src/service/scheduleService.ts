import axios from "axios";
import { VideoStreamPageSchema } from "../types";

const baseUrl = "/api/schedule";

const getSchedule = async (
    status: "live" | "upcoming" | "past",
    sortBy: string,
    sortOrder: "asc" | "desc",
    pageSize: number = 25,
    pageNumber: number = 0,
) => {
    const response = await axios
        .get(baseUrl, {
            params: {
                status,
                sortBy,
                sortOrder,
                pageSize,
                pageNumber,
            },
        })
        .catch((error) => {
            console.error(`Error fetching ${status} schedule:`, error);
            return { data: [] }; // Return empty array on error to prevent crashes
        });

    return VideoStreamPageSchema.parse(response.data).content || [];
};

export const scheduleService = {
    getSchedule,
};
