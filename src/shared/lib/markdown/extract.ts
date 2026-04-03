export interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export function extractTOC(mdxContent: string): TOCItem[] {
    const headRegex = /^(#{1,3})\s+(.+)$/gm; //h3까지만 인덱싱
    const toc: TOCItem[] = [];
    let match;

    while ((match = headRegex.exec(mdxContent)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();

        const id = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣-]/g, "") 
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
        toc.push({ id, text, level });
    }

    return toc;


}