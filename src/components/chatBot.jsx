import React from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import { iPlayerTheme } from "../themes/appThemes";

const steps = [
  {
    id: '0',
    message: 'Welcome to react chatbot!',
    trigger: '1',
  },
  {
    id: '1',
    user: true,
    end: true,
  }
];

const ChatBotComponent = () => (
  <ThemeProvider theme={iPlayerTheme}>
    <ChatBot
        headerTitle={'iPlayer ChatBot'}
        floating
        steps={steps} />
  </ThemeProvider>
);

export default ChatBotComponent;