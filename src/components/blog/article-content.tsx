import Link from "next/link";
import type { BlogBlock, RichText } from "@/content/blog";

function Text({ content }: { content: RichText }) {
  return <>{content.map((part, index) => {
    const value = part.strong ? <strong>{part.text}</strong> : part.text;
    if (!part.href) return <span key={index}>{index ? " " : ""}{value}</span>;
    const link = part.href.startsWith("/") ? <Link href={part.href}>{value}</Link> : <a href={part.href}>{value}</a>;
    return <span key={index}>{index ? " " : ""}{link}</span>;
  })}</>;
}

export function ArticleContent({ blocks }: { blocks: BlogBlock[] }) {
  return <div className="article-prose">{blocks.map((block, index) => {
    if (block.type === "heading") return block.level === 2 ? <h2 id={block.id} key={index}>{block.text}</h2> : <h3 id={block.id} key={index}>{block.text}</h3>;
    if (block.type === "paragraph") return <p key={index}><Text content={block.content}/></p>;
    if (block.type === "list") {
      const List = block.ordered ? "ol" : "ul";
      return <List key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><Text content={item}/></li>)}</List>;
    }
    if (block.type === "checklist") return <aside className="article-checklist" key={index}>{block.title && <h3>{block.title}</h3>}<ul>{block.items.map((item, itemIndex) => <li key={itemIndex}><Text content={item}/></li>)}</ul></aside>;
    if (block.type === "callout") return <aside className="article-callout" key={index}><strong>{block.title}</strong><p><Text content={block.content}/></p></aside>;
    return <div className="article-table-wrap" key={index}><table><caption>{block.caption}</caption><thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
  })}</div>;
}
