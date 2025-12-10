import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";

const WORDS_READ_PER_MINUTE = 220;

export function formatDate(date: Date): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}`;
}

// Return the time needed to read a provided markdown document.
export function getReadingTime(text: string): (string | undefined) {
    if (!text || !text.length) return undefined;

    try {
        const minutes = calculateReadingTime(
            calculateWordCount(toString(fromMarkdown(text))));

        if (minutes && minutes > 0) {
            return minutes.toString();
        }
        return undefined;
    } catch (_) {
        return undefined;
    }
}

// Calculate the approximate word count.
function calculateWordCount(text: string): number {
    return text.split(/\s+/).length;
}

// Calculate approximate reading time in minutes.
function calculateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / WORDS_READ_PER_MINUTE);
}
