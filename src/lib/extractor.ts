// src/lib/extractor.ts
import path from "path";

export async function extractText(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const ext = path.extname(filename).toLowerCase();

  switch (ext) {
    case ".pdf": {
      const pdfParse = (await import("pdf-parse")).default;
      const result = await pdfParse(buffer);
      return result.text;
    }
    case ".docx": {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    case ".txt":
      return buffer.toString("utf-8");
    default:
      throw new Error(
        `Unsupported file type: ${ext}. Please use PDF, DOCX, or TXT.`
      );
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}