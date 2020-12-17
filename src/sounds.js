import React from 'react';
import ChatBot from "./components/sounds-chatbot";
import './css/App.css';
import './css/chatbot-css-sounds.css';
function SoundsApp() {
    return (
        <div className="sounds body-frame">
            <iframe src="https://bbc.co.uk/sounds" title="W3Schools Free Online Web Tutorials" width="100%" height="100%">
</iframe>
             <ChatBot />
        </div>
    );
}

export default SoundsApp;
