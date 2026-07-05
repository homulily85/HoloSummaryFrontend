import { z } from "zod";

export const PageMetadataSchema = z.object({
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
});

export function createPageSchema<ItemType extends z.ZodTypeAny>(
    itemSchema: ItemType,
) {
    return z.object({
        content: z.array(itemSchema),
        page: PageMetadataSchema,
    });
}

export const ChannelSchema = z.object({
    channelId: z.string(),
    name: z.string(),
    englishName: z.string().nullable(),
    photo: z.string(),
    group: z.object({
        name: z.string(),
    }),
});

export const VideoSchema = z.object({
    videoId: z.string(),
    title: z.string(),
    type: z.string(),
    topic: z.string().nullable(),
    duration: z.number(),
    status: z.string(),
    availableAt: z.string().transform((str) => new Date(str)),
    channel: ChannelSchema,
});

export const ChannelPageSchema = createPageSchema(ChannelSchema);
export const VideoPageSchema = createPageSchema(VideoSchema);

export type Channel = z.infer<typeof ChannelSchema>;
export type ChannelPage = z.infer<typeof ChannelPageSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type VideoPage = z.infer<typeof VideoPageSchema>;
export type PageMetadata = z.infer<typeof PageMetadataSchema>;
