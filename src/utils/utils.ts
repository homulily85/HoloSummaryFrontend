import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: string[]) {
    return twMerge(clsx(inputs));
}

export function toHumanReadableDuration(duration: number): string {
    if (duration === 0) return "0s";

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor(duration / 60) % 60;
    const seconds = duration % 60;

    const hStr = hours > 0 ? `${hours}h ` : "";
    const mStr = minutes > 0 ? `${minutes}m ` : "";
    const sStr = seconds > 0 ? `${seconds}s` : "";

    return `${hStr}${mStr}${sStr}`.trim();
}
