import { apiClient } from "../utils/apiClient";

const getSummary = async (videoId: string) => {
    try {
        const response = await apiClient.get(`/summary/${videoId}`);

        if (response.status === 202) {
            return { state: "waiting", data: null };
        }

        return {
            state: "finished",
            data: response.data?.text ?? "No summary available.",
        };
    } catch (error: unknown) {
        console.error(
            `Error fetching summary for video ${videoId}:`,
            error,
        );
        return { state: "failed", data: null };
    }
};

export const summaryService = {
    getSummary,
};
