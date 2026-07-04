// 브라우저 환경에서 SDK 충돌을 막기 위해 순수 fetch API로 Gemini 1.5 Flash 호출
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export async function analyzeVoiceRecord(text: string) {
  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    console.error("Gemini API Key가 올바르지 않습니다. 'AIzaSy'로 시작하는 키여야 합니다.");
    // 데모 편의성을 위해 에러 발생 대신 프롬프트에서 즉시 alert를 띄우도록 null 반환
    return null;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `다음은 사회복지사가 방문하여 녹음한 음성 텍스트 기록입니다.\n\n"${text}"\n\n이 텍스트를 분석하여 다음 JSON 스키마에 맞게 결과를 반환해주세요. 반드시 JSON 포맷만 반환해야 합니다.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                symptom: { type: 'STRING', description: '발견된 핵심 증상이나 특이사항 (1문장 이내)' },
                conclusion: { type: 'STRING', description: '상태 요약 및 위험 결론 (1-2문장)' },
                confidence: { type: 'INTEGER', description: '분석 신뢰도 (0에서 100 사이의 숫자)' },
                careGuide: { 
                  type: 'ARRAY', 
                  items: { type: 'STRING' },
                  description: '다음 방문 시 사회복지사가 확인해야 할 행동 지침 3가지'
                },
                clinicalReport: { type: 'STRING', description: '보호자 및 의료진에게 공유하기 좋은 정중한 톤의 종합 소견 보고서' }
              },
              required: ["symptom", "conclusion", "confidence", "careGuide", "clinicalReport"]
            }
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Gemini API Error Status:', response.status);
      return null;
    }

    const data = await response.json();
    const resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (resultText) {
      return JSON.parse(resultText);
    }
    return null;
  } catch (error) {
    console.error('Gemini API Fetch Error:', error);
    return null;
  }
}
