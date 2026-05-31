import { apiClient } from "../utils/apiClient";

const getSummary = async (videoId: string) => {
    const response = await apiClient
        .get(`/summary/${videoId}`)
        .catch((error: unknown) => {
            console.error(
                `Error fetching summary for video ${videoId}:`,
                error,
            );
            return { data: "No summary available." };
        });

    return response.data?.text ?? "No summary available.";
};

export const summaryService = {
    getSummary,
};
