import { Fragment } from "react";

/**
 * A small preview of the Markdown a contributor is typing. It builds React
 * elements rather than HTML, so nothing typed into the form can inject markup.
 */
function inline(text: string, key: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    const k = `${key}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={k}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={k}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={k}>{part.slice(1, -1)}</em>;
    return <Fragment key={k}>{part}</Fragment>;
  });
}

export function MarkdownPreview({ source }: { source: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let code: string[] | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(<p key={`p${blocks.length}`}>{inline(paragraph.join(" "), `p${blocks.length}`)}</p>);
    paragraph = [];
  };
  const flushList = () => {
    if (!listItems.length) return;
    blocks.push(
      <ul key={`u${blocks.length}`}>
        {listItems.map((item, i) => (
          <li key={i}>{inline(item, `u${blocks.length}-${i}`)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      if (code) {
        blocks.push(
          <pre key={`c${blocks.length}`}>
            <code>{code.join("\n")}</code>
          </pre>,
        );
        code = null;
      } else {
        flushParagraph();
        flushList();
        code = [];
      }
      continue;
    }
    if (code) {
      code.push(line);
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const Tag = (["h2", "h3", "h4", "h5"] as const)[level - 1];
      blocks.push(<Tag key={`h${blocks.length}`}>{heading[2]}</Tag>);
      continue;
    }
    const item = /^\s*[-*]\s+(.*)$/.exec(line);
    if (item) {
      flushParagraph();
      listItems.push(item[1]);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }
  flushParagraph();
  flushList();
  if (code?.length)
    blocks.push(
      <pre key="c-last">
        <code>{code.join("\n")}</code>
      </pre>,
    );

  return <>{blocks}</>;
}
