import {GoogleGenerativeAI} from "@google/generative-ai";


const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

interface Filters {
    focusArea: string;
    summaryLength: string;
    summaryFormat: string;
    showKeywords: boolean;
};

if(!apiKey){
    console.log(apiKey)
    throw new Error("Missing API Key");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (transcript : string , filters:Filters) => {
    const { focusArea, summaryLength, summaryFormat, showKeywords } = filters;

    const prompt = `
        You are an AI that summarizes YouTube transcripts based on user preferences. 
        Your task is to generate a clear, structured, and **concise summary** according to the user's selected filters.

        ### **User Preferences:**
        - **Summary Length:** ${summaryLength} (Options: short, medium, long)
        - **Summary Format:** ${summaryFormat} 
        - Options: "paragraphs" (detailed written format),  
            "bullet points" (key points in a list),  
            "topics" (grouped by subject),  
            "timestamps" (list key moments with timestamps)
        - **Focus Area:** ${focusArea}  
        - Options: "key takeaways" (main ideas),  
            "definitions and terms" (technical explanations),  
            "questions and answers" (FAQ-style summary),  
            "general" (balanced overview)
        - **Include Keywords?** ${showKeywords ? "Yes" : "No"}  
        - If yes, **highlight important keywords** relevant to the summary.

        ---

        ### **Task:**
        1. **Analyze the transcript** carefully.
        2. **Generate the summary** strictly following the selected format.
        3. If "timestamps" are selected, **identify key moments** in the transcript and associate them with timestamps.
        4. If "keywords" are enabled, **BOLD important terms** related to the focus area.
        5. Ensure the summary is **coherent, concise, and useful** for a user looking for a quick understanding of the video.

        ---

        ### **Transcript for Summary:**
        ${transcript}

        ---

        ### **Expected Output:**
        - **IMPORTANT : GIVE ME HTML FORMAT SO THAT I CAN DIRECTLY RENDER IT ON THE WEBSITE**
        - **Maintain the chosen format.**
        - **Use clear, structured, and readable language.**
        `;



    const result = await model.generateContent(prompt);
    // console.log(result.response.text());
    return result.response.text(); // return the response
}