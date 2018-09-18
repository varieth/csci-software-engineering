import React, { Component } from "react"
import { TextField, List, ListItem, ListItemText } from "@material-ui/core" //mit reactjs css injection 
import firebase from "firebase" //import datebase
import "./App.css"

class App extends Component {
  /**
   * Initialize constructor
   * @param {*} item 
   */
  constructor(item) {
    super(item)
    this.state = { text: "", messages: [] }
  }

  /**
   * Config generated from firebase console. 
   */
  componentDidMount() {
    // Initialize Firebase. Retrieved from firebase console
    var config = {
      apiKey: "AIzaSyCc6BPqcaZ4Zca8cAKkN4wU8-j_0LdKhrM",
      authDomain: "chat-20684.firebaseapp.com",
      databaseURL: "https://chat-20684.firebaseio.com",
      projectId: "chat-20684",
      storageBucket: "chat-20684.appspot.com",
      messagingSenderId: "394241218361"
    };
    firebase.initializeApp(config);
    this.retrieveMessages()
  }

  /**
   * Writes message to database
   */
  writeToDB = msg => {
    firebase
      .database()
      .ref("messages/")
      .push({
        text: msg
      })
  }

  /**
 * Event that tracks when user enters a message and to reset text field
 */
  submit = event => {
    if (event.charCode === 13 && this.state.text.trim() !== "") {
      this.writeToDB(this.state.text)
      this.setState({ text: "" })
    }
  }

  /**
   * Retrieve all messages from database
   */
  retrieveMessages = () => {
    var msgDB = firebase
      .database()
      .ref("messages/")
      .limitToLast(500)
    msgDB.on("value", snapshot => {
      let newMessages = []
      snapshot.forEach(child => {
        var message = child.val()
        newMessages.push({ id: child.key, text: message.text })
      })
      this.setState({ messages: newMessages })
      this.bottomSpan.scrollIntoView({ behavior: "smooth" })
    })
  }

  /**
   * Display messages
   */
  renderMessages = () => {
    return this.state.messages.map(message => (
      <ListItem>
        <ListItemText
          style={{ wordBreak: "break-word" }}
          primary={message.text}
        />
      </ListItem>
    ))
  }

  /**
   * Basic display format. Uses materials-ui for css and displays messages in DB as a list
   */
  render() {
    return (
      <div className="App">
        <List>{this.renderMessages()}</List>
        <TextField
          autoFocus={true}
          multiline={true}
          rowsMax={3}
          placeholder="Type something.."
          onChange={event => this.setState({ text: event.target.value })}
          value={this.state.text}
          onKeyPress={this.submit}
          style={{ width: "98vw", overflow: "hidden" }}
        />
        <span ref={el => (this.bottomSpan = el)} />
      </div>
    )
  }
}

export default App