import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';


export function SummaryView({ onBack, summary }: { onBack: () => void, summary?: string }) {
    const [cleanedHtml, setCleanedHtml] = useState<string | null>(null);

    useEffect(() => {
        if (summary) {
            const cleanedHtml = summary.replace(/^```html\s*/, "").replace(/```$/, "");
            setCleanedHtml(cleanedHtml);
        }
    }, [summary])

    const handleCopy = () => {
        if (cleanedHtml) {
            // Create a temporary div to hold the cleaned HTML and extract the plain text
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = cleanedHtml;

            // Get the text content from the temporary div (this removes all HTML tags)
            const plainText = tempDiv.innerText || tempDiv.textContent;

            // Use the Clipboard API to copy the plain text
            if (plainText) {
                navigator.clipboard.writeText(plainText)
                    .then(() => {
                        alert("Summary copied to clipboard!"); // Optional: You can show a confirmation message
                    })
                    .catch((error) => {
                        alert("Failed to copy: " + error);
                    });
            }
        }
    };

    return (
        <div className="w-[400px]  bg-gray-900 summary-container min-h-[600px]  p-4">
            <div className="flex items-center gap-2 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-blue-500" />
                </button>
                <h1 className="text-xl font-semibold">Video Summary</h1>
            </div>
            <button
                onClick={handleCopy}
                className=" p-2 bg-blue-500 text-white rounded-md hover:bg-blue-400 cursor-pointer transition-colors"
            >
                Copy Summary
            </button>
            {cleanedHtml && (
                < >

                    <div
                        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                        className="mb-4 space-y-3 font-semibold text-gray-300"
                    />

                </>
            )}
        </div>
    );
}