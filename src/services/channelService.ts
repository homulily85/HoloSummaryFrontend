import { ChannelSchema } from "../types";
import { apiClient } from "../utils/apiClient";

const getAllChannels = async () => {
    const response = await apiClient
        .get("/channels")
        .catch((error: unknown) => {
            console.error("Error fetching channels:", error);
            return { data: [] };
        });

    return ChannelSchema.array().parse(response.data) || [];
};

export const channelService = {
    getChannels: getAllChannels,
};
