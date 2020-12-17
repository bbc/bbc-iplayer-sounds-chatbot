import React from 'react';
import ChatBot from "./components/iplayer-chatbot";
import './css/App.css';
import './css/chatbot-css-iplayer.css';

function IplayerApp() {
    return (
        <div className="iplayer body-frame">
            <iframe src="https://sandbox.bbc.co.uk/iplayer" title="W3Schools Free Online Web Tutorials" width="100%" height="100%">
            </iframe>
            <ChatBot />
        </div>
    );
}

export default IplayerApp;
