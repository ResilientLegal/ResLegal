// src/services/LangchainClient.js
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as pdfjsLib from "pdfjs-dist"; 

// --- FIX 1: Configure the PDF Worker ---
// Without this, PDF parsing often hangs or crashes in the browser
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

if (!import.meta.env.VITE_OPENAI_API_KEY) {
  console.warn("VITE_OPENAI_API_KEY is not set. LangChain client will not work.");
}

// --- FIX 2: Simple In-Memory Context ---
// We store the extracted text here so askBot can access it later.
let currentPdfContent = ""; 

const model = new ChatOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  // Note: Check your specific model name. usually "gpt-4o-mini" or "gpt-3.5-turbo"
  model: "gpt-4o-mini", 
  temperature: 0.4,
});

const basePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an AI assistant embedded inside a legal matters management app called ResLegal.
You answer clearly and concisely. If the user asks about law, remind them this is not legal advice.`,
  ],
  ["human", "{input}"],
]);

const chain = basePrompt.pipe(model);

export async function askBot(input) {
  let finalInput = input;

  // --- FIX 3: Inject Context ---
  // If we have a PDF loaded, we explicitly tell the bot to look at it.
  if (currentPdfContent) {
    finalInput = `
Context from the uploaded PDF:
"""
${currentPdfContent}
"""

User Question: ${input}
    `.trim();
  }

  // Debug: see what we are sending to OpenAI
  console.log("Sending to Bot:", finalInput);

  const res = await chain.invoke({ input: finalInput });

  if (typeof res.content === "string") return res.content;

  if (Array.isArray(res.content)) {
    return res.content.map((c) => c.text || "").join("\n");
  }
  return String(res.content ?? "");
}

// -------- PDF HELPERS --------

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  // Load the document using the worker
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let text = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    text += pageText + "\n\n";
  }
  return text;
}

export async function summarizePdf(file) {
  // 1. Extract text
  const rawText = await extractPdfText(file);

  // 2. Save to our "memory" variable (Trimmed to prevent token overflow)
  // Adjust 20000 based on your model's limit.
  currentPdfContent = rawText.slice(0, 20000); 

  // 3. Prepare summary prompt
  const summaryPrompt = `
You will receive text extracted from a PDF document.

Summarize it in 5–8 short bullet points focusing on the most important ideas.
Use plain language. If the text looks incomplete, summarize what is available.

PDF text:
${currentPdfContent.slice(0, 10000)} 
  `.trim();

  // Note: We call chain.invoke directly here to avoid double-injecting the context
  // or we can just use askBot, but we want a specific summary format.
  const res = await chain.invoke({ input: summaryPrompt });
  
  return typeof res.content === "string" ? res.content : String(res.content);
}