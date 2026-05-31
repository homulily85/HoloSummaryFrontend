import { apiClient } from "../utils/apiClient";

const addToFavorites = (channelId: string) => {
    apiClient.post("/favorites", { channelId }).catch((error: unknown) => {
        console.error(`Error adding channel ${channelId} to favorites:`, error);
    });
};

const removeFromFavorites = (channelId: string) => {
    apiClient
        .delete(`/favorites`, { data: { channelId } })
        .catch((error: unknown) => {
            console.error(
                `Error removing channel ${channelId} from favorites:`,
                error,
            );
        });
};

export const userService = {
    addToFavorites,
    removeFromFavorites,
};