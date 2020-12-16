import React, { Component } from "react";
import PropTypes from "prop-types";
import AWS from "aws-sdk";
import "../styles/chatbot.css";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";

class LexChat extends Component {
  constructor(props) {
    super(props)
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

  handleClick() {
    this.setState({
      visible: this.state.visible == "open" ? "closed" : "open",
    });
    if (this.props.debugMode === true) {
      console.log(this.state);
    }
  }

  pushChat(event) {
    let inputFieldText = event;

    if (
      inputFieldText &&
      inputFieldText.trim().length > 0
    ) {

      console.log("🚀 ~ file: amazon-lex.jsx ~ line 79 ~ LexChat ~ pushChat ~ props", this.props)

      // send it to the Lex runtime
      let params = {
        botAlias: this.props.alias,
        botName: this.props.botName,
        inputText: inputFieldText,
        userId: this.state.lexUserId,
        sessionAttributes: this.state.sessionAttributes,
      };
      console.log("🚀 ~ file: amazon-lex.jsx ~ line 78 ~ LexChat ~ pushChat ~ params", params)


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
          console.log("🚀 ~ file: amazon-lex.jsx ~ line 93 ~ LexChat ~ a ~ data", data)
          // capture the sessionAttributes for the next cycle
          this.setState({ sessionAttributes: data.sessionAttributes });
          // show response and/or error/dialog status
          addResponseMessage(data.message);
        }
      };

      this.lexruntime.postText(params, a.bind(this));
    }
    // we always cancel form submission
    return false;
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({ data: event.target.value });
  }

  render() {
    return <Widget handleNewUserMessage={this.pushChat} />;
  }
}

// LexChat.propTypes = {
//   alias: PropTypes.string,
//   botName: PropTypes.string,
//   IdentityPoolId: PropTypes.string.isRequired,
//   placeholder: PropTypes.string.isRequired,
//   backgroundColor: PropTypes.string,
//   height: PropTypes.number,
//   headerText: PropTypes.string,
//   headerColor: PropTypes.string,
//   headerBackgroundColor: PropTypes.string,s
//   headerFontSize: PropTypes.number,
//   sessionAttributes: PropTypes.object,
//   debugMode: PropTypes.bool,
// };

LexChat.defaultProps = {
  alias: "$LATEST",
  headerStyle: {},
  greeting: "",
  sessionAttributes: {},
  debugMode: false,
};

export default LexChat;
