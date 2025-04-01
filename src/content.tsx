import { createRoot } from "react-dom/client";

const container = document.createElement("div");
container.id = "floating-summary-widget";

Object.assign(container.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "9999",
});

document.body.appendChild(container);

const FloatingWidget = () => {
    const openExtensionPopup = () => {
        chrome.runtime.sendMessage({ action: "open_popup" });
    };


    return (
        <button
            className=" bg-blue-600 text-white  p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition"
            onClick={openExtensionPopup}
            style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        >
            📄 Open Summary
        </button>

    );
};

createRoot(container).render(<FloatingWidget />);