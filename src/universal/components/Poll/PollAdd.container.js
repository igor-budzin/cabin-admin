import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import PollForm from './PollForm';

export default class PollAdd extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      sendingForm: false
    };
  }

  handleCreatePoll = poll => {
    this.setState({ sendingForm: true });

    const reqBody = {
      title: poll.title,
      publish: poll.publish,
      answer: poll.answers.map((answer, index) => {
        answer.id = index;
        return answer;
      })
    }

    const promise = fetch(`http://localhost:8080/api/poll`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => {
        this.setState({ sendingForm: false });
      })
      .catch(err => {
        this.setState({ sendingForm: false });
        console.log(err)
      });
  }

  render() {
    const {
      sendingForm
    } = this.state;

    return (
      <Fragment>
        <div className="margin-wrapper">
          <h2>Додати голосування</h2>
          <div className="right">
            <Link to="/poll">Всі голосування</Link>
          </div>
        </div>

        <div className="divider"></div>

        <div className="margin-wrapper">
          <PollForm
            sendingForm={sendingForm}
            handleCreatePoll={this.handleCreatePoll}
          />
        </div>
      </Fragment>
    );
  }
}