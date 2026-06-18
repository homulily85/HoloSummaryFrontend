import { ChannelSchema } from "../types";
import { apiClient } from "../utils/apiClient";

const getAllChannels = async (favourite: boolean) => {
    const response = await apiClient
        .get("/channels", { params: { favourite } })
        .catch((error: unknown) => {
            console.error("Error fetching channels:", error);
            return { data: [] };
        });

    return ChannelSchema.array().parse(response.data) || [];
};

export const channelService = {
    getChannels: getAllChannels,
};
