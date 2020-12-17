import React from 'react';
import ChatBot from "./components/iplayer-chatbot";
import './css/App.css';
import './css/chatbot-css-iplayer.css';

function IplayerApp() {
    return (
        <div className="iplayer">
             <ChatBot />
        </div>
    );
}

export default IplayerApp;
