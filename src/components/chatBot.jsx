import React from "react";
// import { ThemeProvider } from "styled-components";
// import { iPlayerTheme } from "../themes/appThemes";
// import { Widget, renderCustomComponent } from "react-chat-widget";
import LexChat from "./amazon-lex";

const ChatBotComponent = () => (
    <LexChat
      botName="bbciPlayerSoundsChatbot"
      IdentityPoolId="eu-west-2:e1f14c95-8241-493e-826c-4a4b6873ef88"
      placeholder="Placeholder text"
      backgroundColor="#FFFFFF"
      height="430px"
      region="eu-west-2"
      headerText="Chat with our awesome bot"
      headerStyle={{ backgroundColor: "#ABD5D9", fontSize: "30px" }}
      greeting={
        "Hello, how can I help? You can say things like 'help' to get more info"
      }
      alias='beta'
    />
);

export default ChatBotComponent;
