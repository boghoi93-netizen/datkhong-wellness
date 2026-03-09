import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, QuestionnaireAnswers, UserInfo } from '../types';

// Initialize the Gemini API client
const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeTongueImage(
  base64Image: string, 
  mimeType: string,
  answers: QuestionnaireAnswers,
  userInfo: UserInfo
): Promise<Omit<AnalysisResult, 'id' | 'timestamp' | 'imageUrl' | 'userInfo'>> {
  try {
    console.log("Starting analyzeTongueImage...");
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(userInfo.birthYear);

    const prompt = `
      Bạn là một chuyên gia Đông y (Y học cổ truyền) giàu kinh nghiệm.
      Hãy phân tích hình ảnh lưỡi và kết hợp với thông tin cá nhân, câu trả lời của người dùng để chẩn đoán thể trạng sức khỏe.
      
      Thông tin người dùng:
      - Tên: ${userInfo.name}
      - Tuổi: ${age} (${userInfo.birthYear})
      - Giới tính: ${userInfo.gender}

      Câu trả lời của người dùng:
      - Mệt mỏi: ${answers.fatigue}
      - Tiêu hóa: ${answers.digestion}
      - Nhiệt độ cơ thể: ${answers.temperature}
      - Giấc ngủ: ${answers.sleep}
      - Đại tiện: ${answers.bowel}
      
      Yêu cầu:
      1. Phân tích các đặc điểm của lưỡi: màu sắc, rêu lưỡi, độ ẩm, vết nứt, độ dày rêu, dấu hằn răng, độ sưng.
      2. Chấm điểm sức khỏe tổng thể (Health Score) từ 0 đến 100.
      3. Đánh giá các chỉ số sức khỏe: Tỳ khí (0-100), Khí huyết (0-100), Độ thấp (0-100).
      4. Xác định thể trạng Đông y chính xác (ví dụ: Tỳ khí hư kèm thấp, Khí huyết lưỡng hư, v.v.).
      5. Giải thích ngắn gọn, dễ hiểu cho người phổ thông về thể trạng này.
      6. Gợi ý thực đơn 7 ngày (Sáng, Trưa, Tối) phù hợp với thể trạng.
      7. Gợi ý 3-5 bài tập thể chất đơn giản tại nhà.
      8. Gợi ý 3-5 nhắc nhở chăm sóc sức khỏe trong ngày (ví dụ: 7:00 Uống nước ấm).
      
      Tất cả nội dung phải bằng TIẾNG VIỆT, dùng từ ngữ đơn giản, thân thiện, dễ hiểu.
    `;

    console.log("Calling ai.models.generateContent...");
    
    // Create a promise that rejects after 45 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Yêu cầu phân tích quá thời gian (timeout). Vui lòng thử lại.")), 45000);
    });

    const apiPromise = ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.INTEGER, description: "Điểm sức khỏe tổng thể (0-100)" },
            indices: {
              type: Type.OBJECT,
              properties: {
                vitality: { type: Type.INTEGER, description: "Chỉ số Khí huyết (0-100)" },
                digestion: { type: Type.INTEGER, description: "Chỉ số Tỳ vị (0-100)" },
                dampness: { type: Type.INTEGER, description: "Chỉ số Độ thấp (0-100)" }
              },
              required: ["vitality", "digestion", "dampness"]
            },
            tongueFeatures: {
              type: Type.OBJECT,
              properties: {
                color: { type: Type.STRING, description: "Màu sắc lưỡi" },
                coating: { type: Type.STRING, description: "Màu sắc rêu lưỡi" },
                moisture: { type: Type.STRING, description: "Độ ẩm của lưỡi" },
                cracks: { type: Type.STRING, description: "Tình trạng vết nứt trên lưỡi" },
                coatingThickness: { type: Type.STRING, description: "Độ dày của rêu lưỡi" },
                teethMarks: { type: Type.STRING, description: "Dấu hằn răng trên mép lưỡi" },
                swelling: { type: Type.STRING, description: "Độ sưng của lưỡi" }
              },
              required: ["color", "coating", "moisture", "cracks", "coatingThickness", "teethMarks", "swelling"]
            },
            constitutionType: {
              type: Type.STRING,
              description: "Tên thể trạng Đông y (ví dụ: Tỳ khí hư kèm thấp)"
            },
            explanation: {
              type: Type.STRING,
              description: "Giải thích ngắn gọn, dễ hiểu về thể trạng"
            },
            mealPlan: {
              type: Type.OBJECT,
              properties: {
                monday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] },
                tuesday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] },
                wednesday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] },
                thursday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] },
                friday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] },
                saturday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] },
                sunday: { type: Type.OBJECT, properties: { breakfast: { type: Type.STRING }, lunch: { type: Type.STRING }, dinner: { type: Type.STRING } }, required: ["breakfast", "lunch", "dinner"] }
              },
              required: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            },
            exerciseSuggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Tên bài tập" },
                  duration: { type: Type.STRING, description: "Thời gian tập (ví dụ: 15 phút)" },
                  benefit: { type: Type.STRING, description: "Tác dụng của bài tập" }
                },
                required: ["name", "duration", "benefit"]
              },
              description: "Danh sách 3-5 bài tập phù hợp"
            },
            reminders: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING, description: "Thời gian (ví dụ: 07:00)" },
                  task: { type: Type.STRING, description: "Nội dung nhắc nhở (ví dụ: Uống nước ấm)" }
                },
                required: ["time", "task"]
              },
              description: "Danh sách 3-5 nhắc nhở chăm sóc sức khỏe"
            }
          },
          required: ["healthScore", "indices", "tongueFeatures", "constitutionType", "explanation", "mealPlan", "exerciseSuggestions", "reminders"]
        }
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;

    console.log("Received response from AI");
    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error("Không nhận được phản hồi từ AI.");
    }

    console.log("Parsing JSON response...");
    const result = JSON.parse(jsonStr);
    console.log("Successfully parsed JSON");
    return result;
  } catch (error: any) {
    console.error("Lỗi khi phân tích ảnh:", error);
    throw new Error(error.message || "Có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại.");
  }
}
