import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import {
  Button, Form, FormGroup, Label, Input, FormText, Col, Row,
  InputGroup, InputGroupAddon, InputGroupButtonDropdown, Spinner,
  InputGroupDropdown, Modal, ModalHeader, ModalBody, ModalFooter,
  Alert
} from 'reactstrap';

import InfinityLoaderSVG from 'universal/sections/InfinityLoaderSVG';
import MusicItem from 'universal/sections/MusicItem';

const defaultState = {
  title: '',
  answers: [
    { title: '', audioId: '' },
    { title: '', audioId: '' }
  ],
  publish: false,
  error: '',
  sendingForm: false,

  audioArr: [],
  audioListReady: false,
  modal: false,
  limitPerPage: 15,
  page: 0,
  hasNextPage: false,
  count: 0,
  indexForAudio: ''
}

export default class PollAdd extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...defaultState,
      answers: [
        { title: '', audioId: '' },
        { title: '', audioId: '' }
      ]
    };
  }

  resetStateWithUpdates = (stateUpdates = {}) => {
    this.setState({
      ...defaultState,
      answers: [
        { title: '', audioId: '' },
        { title: '', audioId: '' }
      ]
    })
  }

  loadAudioList(page) {
    this.setState({ audioListReady: false });

    let params = {
      "page": parseInt(page + 1, 10),
      "limit": parseInt(this.state.limitPerPage, 10)
    };
    let query = Object.keys(params)
     .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
     .join('&');

    const promise = fetch(`http://localhost:8080/api/audio?${query}`, {
      method: 'get'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({
        page,
        audioArr: data.music,
        hasNextPage: data.hasNextPage,
        count: data.count,
        audioListReady: true
      }))
      .catch(err => {
        this.setState({
          audioListReady: true,
          error: true
        })
        console.log(err)
      });
  }

  addAnswerItem = () => {
    const answers = this.state.answers;
    answers.push({
      title: '',
      audioId: ''
    });

    this.setState({ answers });
  }

  deleteAnswerItem = index => {
    const answers = this.state.answers;
    this.setState({ answers: answers.filter((el, n) => n !== index) });
  }

  onAddAudio = (event, index) => {
    event.preventDefault();
    this.loadAudioList(this.state.page);
    this.toggleModal();
    this.setState({ indexForAudio: index });
  }

  onDeleteAudio = (event, index) => {
    event.preventDefault();
    const answers = this.state.answers;
    answers[index].audioId = '';
    answers[index].title = '';
    this.setState({ answers });
  }

  toggleModal = () => {
    this.setState({ modal: !this.state.modal })
  }

  onChoseAudio = audio => {
    const answers = this.state.answers;
    answers[this.state.indexForAudio].audioId = audio._id;
    answers[this.state.indexForAudio].title = `${audio.artists} - ${audio.title}`;
    this.setState({ answers, modal: false });
  }

  handleCreatePoll = () => {
    this.setState({ sendingForm: true });

    const reqBody = {
      title: this.state.title,
      publish: this.state.publish,
      answer: this.state.answers.map((answer, index) => {
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
      .then(data => this.resetStateWithUpdates())
      .catch(err => console.log(err));

    
  }

  render() {
    const {
      title,
      answers,
      audioArr,
      audioListReady,
      sendingForm,
      publish
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
          <Form>
            <Row form>
              <Col lg={8}>
                <FormGroup>
                  <Label for="title">Заголовок</Label>
                  <Input
                    value={title}
                    onChange={e => this.setState({ title: e.target.value })}
                    type="text"
                    name="title"
                    id="title"
                    tabIndex="1"
                    disabled={sendingForm}
                  />
                </FormGroup>

                <legend>Варіанти відповіді</legend>

                {answers.map((answer, index) => {
                  return(
                    <FormGroup row key={index}>
                      <Col>
                        <InputGroup>
                          <InputGroupAddon addonType="prepend">{index.toString()}</InputGroupAddon>
                          <Input
                            value={answer.title}
                            title={answer.title}
                            onChange={e => {
                              answers[index].title = e.target.value;
                              this.setState({ answers });
                            }}
                            type="text"
                            tabIndex={index + 2}
                            disabled={sendingForm || answers[index].audioId}
                          />
                          <InputGroupAddon addonType="append">
                            {answer.audioId ?
                              <Button color="danger" disabled={sendingForm} onClick={e => this.onDeleteAudio(e, index)}>Аудіо</Button>:
                              <Button color="success" disabled={sendingForm} onClick={e => this.onAddAudio(e, index)}>Аудіо</Button>
                            }
                          </InputGroupAddon>
                        </InputGroup>
                      </Col>
                      {index > 1 && (
                        <Col lg={2}>
                          <Button
                            block
                            color="danger"
                            onClick={() => this.deleteAnswerItem(index)}
                            disabled={sendingForm}
                          >
                            X
                          </Button>
                        </Col>
                      )}
                    </FormGroup>
                  )
                })}

                {answers.length < 5 && (
                  <FormGroup>
                    <Button color="success" disabled={sendingForm} onClick={this.addAnswerItem}>Додати ще</Button>
                  </FormGroup>
                )}

                <div className="divider"></div>

                <FormGroup>
                  <Button
                    color="primary"
                    onClick={this.handleCreatePoll}
                    disabled={sendingForm}
                  >
                    {sendingForm && <span><Spinner className="spinner-offset" size="sm" color="light" /></span>}
                    Створити голосування
                  </Button>

                  <div style={{"marginTop": "9px", "display": "inline-block", "float": "right"}}>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={publish}
                        disabled={sendingForm}
                        onChange={() => this.setState({ publish: !publish })}
                      />
                      Опублікувати
                    </Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>

        <Modal
          centered
          isOpen={this.state.modal}
          toggle={this.toggleModal}
          className={this.props.className}
        >
          <ModalHeader>Виберіть аудіозапис</ModalHeader>
          <ModalBody>
            <ReactPlaceholder
              showLoadingAnimation
              ready={audioListReady}
              customPlaceholder={(
                <div className="empty-message">
                  <InfinityLoaderSVG style={{'margin': '0 auto', 'width': '240px'}} />
                </div>
              )}
            >
            {audioArr.map((audio, index) => {
              return(
                <div key={index} className="clearfix">
                  <MusicItem
                    currentId={'ddd'}
                    audio={audio}
                    mini={true}
                    isPlaying={false}
                    isLoading={false}
                    onChoseAudio={this.onChoseAudio}
                  />
                </div>
              );
            })}
            </ReactPlaceholder>

          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}