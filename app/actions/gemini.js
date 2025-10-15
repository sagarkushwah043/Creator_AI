"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Make sure you have NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ============================================================
   🔹 Generate new blog content
   ============================================================ */
export async function generateBlogContent(title, category = "", tags = []) {
  try {
    if (!title?.trim()) {
      throw new Error("Title is required to generate content");
    }

    // ✅ Use the free-tier supported model
    const model = genAI.getGenerativeModel({
       model: "gemini-2.5-flash",// ⚠️ FIXED MODEL NAME
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const prompt = `
Write a comprehensive blog post with the title: "${title}"

${category ? `Category: ${category}` : ""}
${tags.length ? `Tags: ${tags.join(", ")}` : ""}

Requirements:
- Write engaging, informative content that matches the title
- Use proper HTML formatting with headers (h2, h3), paragraphs, lists, and emphasis
- Include 3–5 main sections with clear subheadings
- Write in a conversational yet professional tone
- Make it approximately 800–1200 words
- Include practical insights, examples, or actionable advice where relevant
- Use <h2> for main sections and <h3> for subsections
- Use <p> for paragraphs, <ul>/<li> for bullet points
- Use <strong>/<em> for emphasis
- Do not include the title; start with the introduction paragraph.
`;

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    if (!content?.trim() || content.trim().length < 100) {
      throw new Error("Generated content is too short or empty");
    }

    return { success: true, content: content.trim() };
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      success: false,
      error: `❌ Failed to generate content: ${error.message}. Please check your API key or try again.`,
    };
  }
}

/* ============================================================
   🔹 Improve existing blog content
   ============================================================ */
export async function improveContent(currentContent, improvementType = "enhance") {
  try {
    if (!currentContent?.trim()) {
      throw new Error("Content is required for improvement");
    }

    // ✅ Use the same working model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let prompt = "";

    switch (improvementType) {
      case "expand":
        prompt = `
Expand this blog content with more details and examples:

${currentContent}

- Keep existing structure
- Add depth and practical examples
- Maintain tone and HTML formatting
`;
        break;

      case "simplify":
        prompt = `
Simplify this blog content while keeping main points:

${currentContent}

- Use clear, simple language
- Keep HTML tags intact
- Maintain important details
`;
        break;

      default:
        prompt = `
Improve this blog content by making it more engaging and well-structured:

${currentContent}

- Enhance flow, readability, and transitions
- Keep similar length and structure
- Maintain original HTML
`;
    }

    const result = await model.generateContent(prompt);
    const improvedContent = result.response.text();

    return { success: true, content: improvedContent.trim() };
  } catch (error) {
    console.error("Content improvement error:", error);
    return { success: false, error: error.message || "Failed to improve content." };
  }
}
