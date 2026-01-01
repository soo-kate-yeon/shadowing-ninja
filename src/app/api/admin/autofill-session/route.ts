import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Sentence } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { sentences } = await request.json();

    if (!sentences || !Array.isArray(sentences) || sentences.length === 0) {
      return NextResponse.json(
        { error: "Sentences array is required" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Format sentences text
    const sentencesText = sentences.map((s: Sentence) => s.text).join(" ");

    const prompt = `
You are an English learning content creator. Based on the following English transcript excerpt, generate a concise title and helpful description for a learning session.

**Title Requirements:**
- Catchy and describes what learners will practice
- In Korean language

**Description Requirements:**
The description must consist of exactly 2 sentences in Korean:
1. First sentence: Summarize the main topic and content of this video script
2. Second sentence: Explain specific, concrete learning benefits with ACTUAL EXAMPLES from the script
   - Include specific vocabulary/expressions with quotes (e.g., "figure out", "I'd like to~")
   - Mention specific grammar patterns (e.g., 현재완료, 가정법, 관계대명사)
   - Describe practical usage situations (e.g., 회사 미팅, 친구와의 대화, 전화 통화)
   - Be CONCRETE and SPECIFIC, not abstract

**Tone:** Use friendly, conversational Korean ending with "~요" (존댓말 but casual)

**Good Example:**
"이 대화는 카페에서 음료를 주문하는 상황에 대한 내용이에요. 'I'd like to~'와 'Can I get~' 같은 주문 표현과 함께 would like 패턴을 실제 상황에서 어떻게 쓰는지 배울 수 있어요."

**Bad Example (too abstract):**
"이 대화는 주문에 대한 내용이에요. 주문 표현을 배울 수 있어요." ❌

Transcript excerpt:
"${sentencesText}"

Return ONLY a valid JSON object (no markdown formatting) with this structure:
{
  "title": "간단하고 매력적인 제목 (한국어)",
  "description": "첫 번째 문장: 영상 내용 요약. 두 번째 문장: 구체적인 학습 베네핏 (실제 표현과 예시 포함)."
}

CRITICAL: Second sentence MUST include specific examples from the transcript with quotes. Be concrete, not abstract.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    let autofillData: { title: string; description: string };
    try {
      // Clean up potentially wrapped markdown
      const cleanedText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      autofillData = JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse AI response:", responseText);
      throw new Error("AI response was not valid JSON");
    }

    // Validate response structure
    if (!autofillData.title || !autofillData.description) {
      throw new Error("Invalid response structure from AI");
    }

    return NextResponse.json(autofillData);
  } catch (error: any) {
    console.error("Session autofill API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to autofill session details" },
      { status: 500 },
    );
  }
}
