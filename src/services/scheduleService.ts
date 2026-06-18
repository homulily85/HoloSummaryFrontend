import { VideoPageSchema, VideoSchema } from "../types";
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
            return { 
                data: { 
                    content: [], 
                    page: { size: 25, totalElements: 0, totalPages: 0, number: 0 } 
                } 
            };
        });
    return VideoPageSchema.parse(response.data).content || [];
};

const getVideoById = async (id: string) => {
    const response = await apiClient
        .get(`/schedule/${id}`)
        .catch((error: unknown) => {
            console.error(`Error fetching video with id ${id}:`, error);
            return { data: null };
        });

    return response.data ? VideoSchema.parse(response.data) : null;
};

export const scheduleService = {
    getSchedule,
    getVideoById,
};