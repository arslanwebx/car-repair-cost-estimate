import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb } from "pdf-lib";

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 38;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FOOTER_Y = 20;
const BOTTOM = 42;

const colors = {
  ink: rgb(0.09, 0.14, 0.21),
  navy: rgb(0.04, 0.13, 0.22),
  blue: rgb(0.09, 0.41, 0.88),
  teal: rgb(0.53, 0.9, 0.86),
  muted: rgb(0.38, 0.44, 0.53),
  line: rgb(0.86, 0.89, 0.93),
  card: rgb(0.96, 0.97, 0.98),
  notice: rgb(1, 0.97, 0.88),
  white: rgb(1, 1, 1),
};

function pdfText(value: string) {
  return value
    .replaceAll("\u00a0", " ")
    .replaceAll("·", "-")
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replaceAll("•", "-");
}

function wrap(value: string, font: PDFFont, size: number, maxWidth: number) {
  const words = pdfText(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export class PdfWriter {
  readonly document: PDFDocument;
  readonly regular: PDFFont;
  readonly bold: PDFFont;
  private page!: PDFPage;
  private y = 0;

  private constructor(document: PDFDocument, regular: PDFFont, bold: PDFFont) {
    this.document = document;
    this.regular = regular;
    this.bold = bold;
  }

  static async create(title: string) {
    const document = await PDFDocument.create();
    document.setTitle(pdfText(title));
    document.setAuthor("Carspect");
    document.setCreator("Carspect");
    document.setProducer("Carspect");
    const regular = await document.embedFont(StandardFonts.Helvetica);
    const bold = await document.embedFont(StandardFonts.HelveticaBold);
    const writer = new PdfWriter(document, regular, bold);
    writer.addPage();
    return writer;
  }

  addPage() {
    this.page = this.document.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private ensure(height: number) {
    if (this.y - height < BOTTOM) this.addPage();
  }

  gap(points: number) {
    this.ensure(points);
    this.y -= points;
  }

  text(value: string, options: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; maxWidth?: number; lineHeight?: number } = {}) {
    const size = options.size ?? 9.5;
    const font = options.bold ? this.bold : this.regular;
    const maxWidth = options.maxWidth ?? CONTENT_WIDTH;
    const lineHeight = options.lineHeight ?? size * 1.35;
    const lines = wrap(value, font, size, maxWidth);
    this.ensure(lines.length * lineHeight);
    for (const line of lines) {
      this.page.drawText(line, { x: MARGIN, y: this.y - size, size, font, color: options.color ?? colors.ink });
      this.y -= lineHeight;
    }
  }

  brand(title = "Carspect") {
    this.text(title, { size: 20, bold: true, color: colors.navy, lineHeight: 24 });
  }

  title(value: string) {
    this.gap(14);
    this.text(value, { size: 22, bold: true, color: colors.navy, lineHeight: 27 });
  }

  heading(value: string) {
    this.gap(10);
    this.text(value, { size: 14, bold: true, color: colors.navy, lineHeight: 18 });
    this.gap(3);
  }

  total(label: string, value: string, detail: string) {
    const height = 72;
    this.ensure(height + 12);
    this.gap(8);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: colors.navy });
    this.page.drawText(pdfText(label), { x: MARGIN + 16, y: this.y - 17, size: 8, font: this.bold, color: colors.teal });
    this.page.drawText(pdfText(value), { x: MARGIN + 16, y: this.y - 43, size: 22, font: this.bold, color: colors.white });
    this.page.drawText(pdfText(detail), { x: MARGIN + 16, y: this.y - 60, size: 9, font: this.regular, color: colors.white });
    this.y -= height + 8;
  }

  card(lines: string[]) {
    const prepared = lines.flatMap((line, index) => wrap(line, index === 0 ? this.bold : this.regular, 9.5, CONTENT_WIDTH - 24));
    const height = prepared.length * 13 + 18;
    this.ensure(height + 6);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: colors.card });
    let lineY = this.y - 15;
    prepared.forEach((line, index) => {
      this.page.drawText(line, { x: MARGIN + 12, y: lineY, size: 9.5, font: index === 0 ? this.bold : this.regular, color: colors.ink });
      lineY -= 13;
    });
    this.y -= height + 6;
  }

  row(label: string, value: string, bold = false) {
    const size = 9.5;
    const valueWidth = Math.min(205, this.bold.widthOfTextAtSize(pdfText(value), size));
    const labelLines = wrap(label, bold ? this.bold : this.regular, size, CONTENT_WIDTH - valueWidth - 24);
    const height = Math.max(25, labelLines.length * 13 + 10);
    this.ensure(height);
    labelLines.forEach((line, index) => this.page.drawText(line, { x: MARGIN, y: this.y - 12 - index * 13, size, font: bold ? this.bold : this.regular, color: colors.ink }));
    this.page.drawText(pdfText(value), { x: PAGE_WIDTH - MARGIN - valueWidth, y: this.y - 12, size, font: this.bold, color: colors.ink });
    this.page.drawLine({ start: { x: MARGIN, y: this.y - height }, end: { x: PAGE_WIDTH - MARGIN, y: this.y - height }, thickness: 0.7, color: colors.line });
    this.y -= height;
  }

  notice(title: string, body: string) {
    const bodyLines = wrap(body, this.regular, 9.5, CONTENT_WIDTH - 24);
    const height = 31 + bodyLines.length * 13;
    this.ensure(height + 10);
    this.gap(8);
    this.page.drawRectangle({ x: MARGIN, y: this.y - height, width: CONTENT_WIDTH, height, color: colors.notice });
    this.page.drawText(pdfText(title), { x: MARGIN + 12, y: this.y - 17, size: 10, font: this.bold, color: colors.ink });
    bodyLines.forEach((line, index) => this.page.drawText(line, { x: MARGIN + 12, y: this.y - 34 - index * 13, size: 9.5, font: this.regular, color: colors.ink }));
    this.y -= height + 4;
  }

  async jpeg(dataUri: string, maxHeight = 245) {
    const image = await this.document.embedJpg(dataUri);
    const scale = Math.min(CONTENT_WIDTH / image.width, maxHeight / image.height);
    const width = image.width * scale;
    const height = image.height * scale;
    this.ensure(height + 8);
    this.page.drawImage(image, { x: MARGIN + (CONTENT_WIDTH - width) / 2, y: this.y - height, width, height });
    this.y -= height + 8;
  }

  async save(footerLabel: string) {
    const pages = this.document.getPages();
    pages.forEach((page, index) => {
      page.drawText(pdfText(footerLabel), { x: MARGIN, y: FOOTER_Y, size: 8, font: this.regular, color: colors.muted });
      const pageNumber = `Page ${index + 1} of ${pages.length}`;
      page.drawText(pageNumber, { x: PAGE_WIDTH - MARGIN - this.regular.widthOfTextAtSize(pageNumber, 8), y: FOOTER_Y, size: 8, font: this.regular, color: colors.muted });
    });
    return this.document.save();
  }
}
