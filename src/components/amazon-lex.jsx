import React, {Component} from "react";
import AWS from "aws-sdk";
import {
    Widget,
    addResponseMessage,
    renderCustomComponent,
} from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import {Carrousel, ContentItem} from "@bbc/iplayer-web-components";
import {PlayableCarouselSlice} from "@bbc/sounds-components";

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

    iPlayerCarrouselComponent({entities}) {
        return (
            <Carrousel
                perPage={{xs: 2, m: 3, xl: 4}}
                arrowsOffsetTop={{xl: 44, xxl: 64}}
                // onNextPage={action("onNextPage")}
                // onPrevPage={action("onPrevPage")}
                statsContainer="my-carrousel"
                statsPosition="20"
            >
                {entities.map(({episode}) => (
                    <ContentItem
                        itemsPerRow={{xs: 2, m: 3, xl: 4}}
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

    soundsCarrouselComponent({data}) {
        const cards = data.map(items => ({
            id: items.id,
            image: items.image_url.replace('{recipe}', '288x162'),
            href: "#",
            primaryTitle: items.titles.primary,
            secondaryTitle: items.titles.secondary,
            tertiaryTitle: items.titles.tertiary,
            durationLabel: items.duration.label,
            progress: null
        }));

        return (
            <PlayableCarouselSlice
                cards={cards}
                classes=""
                gridClasses="gel-1/1@xs"
                moduleTitle={"Slice Title"}
                moduleId="basic-item-slice"
                fallbackTitle="Looking empty over here..."
                fallbackText="This is just some fallback text, which shows when the component is empty."
                fillWithBlanks={false}
                totalItems={3}
                numberOfRows={3}
            />
        )
    }

    handleCustomPayload(message) {
        const {platform} = this.props.sessionAttributes;
        const payload = JSON.parse(message);

        if (platform === 'iplayer') {
            renderCustomComponent(this.iPlayerCarrouselComponent, {entities: payload.entities});
        } else {
            renderCustomComponent(this.soundsCarrouselComponent, {data: payload.data});
        }
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
            let a = function (err, data) {
                if (err) {
                    console.log(err, err.stack);
                    this.showError(
                        "Error:  " + err.message + " (see console for details)"
                    );
                }
                if (data) {
                    console.log("🚀 ~ data", data);
                    // capture the sessionAttributes for the next cycle
                    this.setState({sessionAttributes: data.sessionAttributes});
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
        const {title, subtitle, profileAvatar} = this.props;

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
