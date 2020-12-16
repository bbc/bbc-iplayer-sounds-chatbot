import React from "react";
import LexChat from "./amazon-lex";

const ChatBotComponent = () => (
  <LexChat
    botName="bbciPlayerSoundsChatbot"
    title="iPlayer Chatterbot"
    subtitle="Welcome to iPlayer Chatbot"
    profileAvatar={
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/82455870-4c7f-4e1d-bedb-661a3b4deb8b/d6xs5ii-d12ea164-7303-4c5b-ab94-2f0d28be822b.png"
    }
    IdentityPoolId="eu-west-2:e1f14c95-8241-493e-826c-4a4b6873ef88"
    region="eu-west-2"
    headerText="Chat with our awesome bot"
    sessionAttributes={{ platform: "sounds" }}
  />
);

export default ChatBotComponent;
