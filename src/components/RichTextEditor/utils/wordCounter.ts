// Count words and characters in HTML content
export const updateCounts = (html: string): { wordCount: number; characterCount: number } => {
    const plainText = html.replace(/<[^>]*>/g, '').trim();
    const words = plainText ? plainText.split(/\s+/).length : 0;
    const characters = plainText.length;

    return {
        wordCount: words,
        characterCount: characters
    };
}; 