import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

export function formatDate(date: Date) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

export function getReadingTime(text: string): (string | undefined) {
    if (!text || !text.length) return undefined;

    try {
        const minutes = calculateReadingTime(calculateWordCount(toString(fromMarkdown(text))));

        if (minutes && minutes > 0) {
            return minutes.toString();
        }
        return undefined;
    } catch (_) {
        return undefined;
    }
}

function calculateWordCount(text: string): number {
    return text.split(/\s+/).length;
}

function calculateReadingTime(wordCount: number) {
    return Math.ceil(wordCount / 220);
}
