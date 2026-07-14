import type { BlogBlock, RichText } from "./types";

export const text = (value: string): RichText[number] => ({ text: value });
export const link = (value: string, href: string): RichText[number] => ({ text: value, href });
export const bold = (value: string): RichText[number] => ({ text: value, strong: true });
export const p = (...content: RichText[number][]): BlogBlock => ({ type: "paragraph", content });
export const h2 = (id: string, value: string): BlogBlock => ({ type: "heading", level: 2, id, text: value });
export const h3 = (id: string, value: string): BlogBlock => ({ type: "heading", level: 3, id, text: value });
export const list = (items: RichText[], ordered = false): BlogBlock => ({ type: "list", ordered, items });
export const checklist = (title: string, items: RichText[]): BlogBlock => ({ type: "checklist", title, items });
export const callout = (title: string, ...content: RichText[number][]): BlogBlock => ({ type: "callout", title, content });
export const table = (caption: string, headers: string[], rows: string[][]): BlogBlock => ({ type: "table", caption, headers, rows });
