"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { ModeToggle } from "@/components/theme-toggle";

const defaultContent = `# Welcome to Markdown Editor

Start typing in the editor on the left and see the preview on the right.

## Features

- **Live Preview**: See your changes instantly
- **Export as Markdown**: Save your raw markdown text
- **Modern Design**: Clean and intuitive interface
- **Auto-save**: Your content is automatically saved in your browser

## Formatting Examples

### Lists

- Item 1
- Item 2
  - Nested item

### Code

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

### Tables

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

### Links

[Visit GitHub](https://github.com/lukeorriss)
`;

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("markdown-content");
    if (saved) {
      setMarkdown(saved);
    } else {
      setMarkdown(defaultContent);
    }
  }, []);

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById("markdown-preview");

      if (!element) return;

      // Dynamic import to avoid SSR issues
      const { jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("markdown-document.pdf");

      toast({
        title: "PDF exported successfully",
        description: "Your document has been downloaded as a PDF",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your document",
        variant: "destructive",
      });
    }
  };

  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.md";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Markdown exported successfully",
        description: "Your document has been downloaded as a markdown file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your document",
        variant: "destructive",
      });
    }
  };

  const handleResetEditor = () => {
    setMarkdown(``);
  };

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("markdown-content", markdown);
    }
  }, [markdown, isClient]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {useTheme().resolvedTheme === "dark" ? (
            <Link href="https://ldo.dev" target="_blank">
              <Image src="/orriss-labs/O_White.svg" alt="Orriss Labs" width={30} height={30} />
            </Link>
          ) : (
            <Link href="https://ldo.dev" target="_blank">
              <Image src="/orriss-labs/O.svg" alt="Orriss Labs" width={30} height={30} />
            </Link>
          )}
          <h1 className="text-xl font-semibold">Markdown Editor</h1>
        </div>
        <div className="flex gap-2">
          <ModeToggle />
          <Button variant="outline" onClick={handleResetEditor}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Editor
          </Button>
          <Button variant="default" onClick={handleExportMarkdown}>
            <FileText className="mr-2 h-4 w-4" />
            Export MD
          </Button>
          {/* <Button onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button> */}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!isPreviewFullscreen && (
          <div className="w-1/2 border-r p-4 overflow-auto">
            <textarea
              className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none bg-background"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type your markdown here..."
            />
          </div>
        )}

        <div className={`${isPreviewFullscreen ? "w-full" : "w-1/2"} p-4 overflow-auto`} id="markdown-preview">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-muted-foreground">Preview</h2>
            <Button variant="outline" size="icon" onClick={() => setIsPreviewFullscreen((prev) => !prev)} aria-label={isPreviewFullscreen ? "Exit fullscreen preview" : "Enter fullscreen preview"}>
              {isPreviewFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
          <div className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
