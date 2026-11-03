/**
 * Converts sanitized post HTML (the tag set allowed by sanitizePostHtml) to
 * Markdown for AI agents. Not a general-purpose converter.
 */

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

function decodeEntities(text: string) {
  return text
    .replace(/&(nbsp|amp|lt|gt|quot|apos|#39);/g, (match) => ENTITIES[match])
    .replace(/&#(\d+);/g, (_m, code: string) =>
      String.fromCodePoint(Number(code)),
    );
}

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, "i"));
  return match ? decodeEntities(match[1]) : "";
}

export function htmlToMarkdown(html: string): string {
  let md = html.replace(/\r\n?/g, "\n");

  // Code blocks first, so their contents are left alone.
  const blocks: string[] = [];
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_m, inner: string) => {
    const code = decodeEntities(
      inner.replace(/<\/?code[^>]*>/gi, "").replace(/<[^>]+>/g, ""),
    ).replace(/\n+$/, "");
    blocks.push(`\n\n\`\`\`\n${code}\n\`\`\`\n\n`);
    return `\u0000${blocks.length - 1}\u0000`;
  });

  md = md
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, c: string) => `\`${c}\``)
    .replace(
      /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi,
      (_m, level: string, inner: string) =>
        `\n\n${"#".repeat(Number(level))} ${inner.trim()}\n\n`,
    )
    .replace(/<(strong|b)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, "**$3**")
    .replace(/<(em|i)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi, "_$3_")
    .replace(/<s(\s[^>]*)?>([\s\S]*?)<\/s>/gi, "~~$2~~")
    .replace(/<img[^>]*>/gi, (tag) => {
      const src = attr(tag, "src");
      return src ? `![${attr(tag, "alt")}](${src})` : "";
    })
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, (match, inner: string) => {
      const href = attr(match, "href");
      return href ? `[${inner.trim()}](${href})` : inner;
    })
    .replace(/<hr[^>]*>/gi, "\n\n---\n\n")
    .replace(/<br[^>]*>/gi, "  \n")
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_m, inner) => {
      const text = String(inner)
        .replace(/<\/?p[^>]*>/gi, "\n")
        .trim()
        .split("\n")
        .map((line) => `> ${line.trim()}`.trimEnd())
        .join("\n");
      return `\n\n${text}\n\n`;
    })
    .replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (_m, kind: string, inner) => {
      let index = 0;
      const items = String(inner).replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        (_li, body: string) => {
          index += 1;
          const marker = kind.toLowerCase() === "ol" ? `${index}.` : "-";
          const text = body.replace(/<\/?p[^>]*>/gi, " ").trim();
          return `${marker} ${text}\n`;
        },
      );
      return `\n\n${items.replace(/<[^>]+>/g, "").trim()}\n\n`;
    })
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n\n$1\n\n")
    .replace(/<[^>]+>/g, "");

  md = decodeEntities(md)
    .replace(/\u0000(\d+)\u0000/g, (_m, i: string) => blocks[Number(i)])
    .replace(/[ \t]+\n/g, (spaces) => (spaces.startsWith("  ") ? "  \n" : "\n"))
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return md;
}
