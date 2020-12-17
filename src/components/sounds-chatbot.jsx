import React from "react";
import LexChat from "./amazon-lex";

const ChatBotComponent = () => (
  <LexChat
    botName="bbciPlayerSoundsChatbot"
    title="Sounds"
    subtitle="Welcome to Sounds Chatbot"
    profileAvatar={
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLAdTLVEvA_RYPRRGwHrdsG9-lx2ysiMG6Ew&usqp=CAU"
    }
    IdentityPoolId="eu-west-2:e1f14c95-8241-493e-826c-4a4b6873ef88"
    region="eu-west-2"
    headerText="Chat with our awesome bot"
    sessionAttributes={{ platform: "sounds" }}
  />
);

export default ChatBotComponent;
