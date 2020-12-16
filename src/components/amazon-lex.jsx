import React, { Component } from "react";
import AWS from "aws-sdk";
import "../styles/chatbot.css";
import {
  Widget,
  addResponseMessage,
  renderCustomComponent,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import { Carrousel, ContentItem } from "@bbc/iplayer-web-components";
import 'node_modules/@bbc/iplayer-web-components/src/components/organisms/Carrousel/carrousel.css';
import 'node_modules/@bbc/iplayer-web-components/src/components/organisms/ContentItem/contentItem.css';

class LexChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      lexUserId: "chatbot" + Date.now(),
      sessionAttributes: this.props.sessionAttributes,
      visible: "closed",
    };
    this.pushChat = this.pushChat.bind(this);
  }

  componentDidMount() {
    AWS.config.region = this.props.region || "us-west-2";
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: this.props.IdentityPoolId,
    });
    let lexruntime = new AWS.LexRuntime();
    this.lexruntime = lexruntime;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.sessionAttributes &&
      this.props.sessionAttributes !== prevState.sessionAttributes
    ) {
      this.state.sessionAttributes = {
        ...this.state.sessionAttributes,
        ...this.props.sessionAttributes,
      };
    }
  }

  CarrouselComponent({ entities }) {
    return (
      <Carrousel
        perPage={{ xs: 2, m: 3, xl: 4 }}
        arrowsOffsetTop={{ xl: 44, xxl: 64 }}
        // onNextPage={action("onNextPage")}
        // onPrevPage={action("onPrevPage")}
        statsContainer="my-carrousel"
        statsPosition="20"
      >
        {entities.map(({ episode }) => (
          <ContentItem
            itemsPerRow={{ xs: 2, m: 3, xl: 4 }}
            showPlayIcon="hover"
            title="The Assassination of Gianni Versace - American Crime Story"
            subtitle="Series 1: 6. Descent"
            synopsis="The home secretary's bodyguard must prevent her falling victim to an assassination plot."
            imageTemplate="https://ichef.bbci.co.uk/images/ic/{recipe}/p062h0hj.jpg"
            href="#"
            durationSubLabel="58 mins"
            secondarySubLabel="Available for 23 days"
          />
        ))}
      </Carrousel>
    );
  }

  handleCustomPayload(message) {
    const payload = JSON.parse(message);

    renderCustomComponent(this.CarrouselComponent, { entities: payload.entities });
  }

  pushChat(event) {
    let inputFieldText = event;

    if (inputFieldText && inputFieldText.trim().length > 0) {
      // send it to the Lex runtime
      let params = {
        botAlias: this.props.alias,
        botName: this.props.botName,
        inputText: inputFieldText,
        userId: this.state.lexUserId,
        sessionAttributes: this.state.sessionAttributes,
      };

      if (this.props.debugMode === true) {
        console.log(JSON.stringify(params));
      }

      // this.showRequest(inputField);
      let a = function(err, data) {
        if (err) {
          console.log(err, err.stack);
          this.showError(
            "Error:  " + err.message + " (see console for details)"
          );
        }
        if (data) {
          console.log("🚀 ~ data", data);
          // capture the sessionAttributes for the next cycle
          this.setState({ sessionAttributes: data.sessionAttributes });
          // show response and/or error/dialog status
          if (data.messageFormat == "CustomPayload") {
            this.handleCustomPayload(data.message);
          } else {
            addResponseMessage(data.message);
          }
        }
      };

      this.lexruntime.postText(params, a.bind(this));
    }
    // we always cancel form submission
    return false;
  }

  render() {
    const { title, subtitle, profileAvatar } = this.props;

    return (
      <Widget
        profileAvatar={profileAvatar}
        title={title}
        subtitle={subtitle}
        handleNewUserMessage={this.pushChat}
      />
    );
  }
}

LexChat.defaultProps = {
  alias: "$LATEST",
  headerStyle: {},
  greeting: "",
  sessionAttributes: {},
  debugMode: false,
};

export default LexChat;
