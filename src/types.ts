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
    id: z.string(),
    name: z.string(),
    englishName: z.string().nullable(),
    photo: z.string(),
    group: z.object({
        name: z.string(),
    }),
});

export const VideoStreamSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.string(),
    topic: z.string().nullable(),
    duration: z.number(),
    status: z.string(),
    availableAt: z.string().transform((str) => new Date(str)),
    channel: ChannelSchema,
});

export const ChannelPageSchema = createPageSchema(ChannelSchema);
export const VideoStreamPageSchema = createPageSchema(VideoStreamSchema);

export type Channel = z.infer<typeof ChannelSchema>;
export type ChannelPage = z.infer<typeof ChannelPageSchema>;
export type VideoStream = z.infer<typeof VideoStreamSchema>;
export type VideoStreamPage = z.infer<typeof VideoStreamPageSchema>;
export type PageMetadata = z.infer<typeof PageMetadataSchema>;
