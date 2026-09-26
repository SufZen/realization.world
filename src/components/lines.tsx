/**
 * Renders copy with authored line breaks (README "Typography").
 * - Mark natural break points with " | " — each part becomes its own line.
 * - Small words (a, the, and, of, to…) are bound to the next word, and the last two words
 *   of each line are joined, with non-breaking spaces — so no line can end on a weak word
 *   and no single word is left alone on the last line, whatever the column width.
 */
const NBSP = " ";
const WEAK = /(?<=^|[\s ])(a|an|the|and|or|of|in|on|to|for|with|by|at|as|is|are|&|—) +/gi;

export function tidy(text: string): string {
  let out = text.replace(WEAK, (_match, word: string) => `${word}${NBSP}`);
  const words = out.split(" ");
  if (words.length > 2) out = `${words.slice(0, -1).join(" ")}${NBSP}${words[words.length - 1]}`;
  return out;
}

export function Lines({ text }: { text: string }) {
  const parts = text.split(" | ");
  if (parts.length === 1) return <>{tidy(text)}</>;
  return (
    <>
      {parts.map((part, index) => (
        <span className="ln" key={index}>{tidy(part)}{index < parts.length - 1 ? " " : ""}</span>
      ))}
    </>
  );
}

/** Plain-text version (metadata, aria labels): removes the line markers. */
export const plain = (text: string) => text.split(" | ").join(" ");
