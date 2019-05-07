import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import {
  Table, Button, Form, FormGroup, Label, Input, FormText, Col, Row,
  Pagination, PaginationItem, PaginationLink,
  Alert
} from 'reactstrap';

import MusicItem from 'universal/sections/MusicItem';
import InfinityLoaderSVG from 'universal/sections/InfinityLoaderSVG';

export default class AudioContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      audioArr: [],
      newAudio: false,
      audioListReady: true,
      audioReady: true,
      audioData: {},
      limitPerPage: 30,
      page: 0,
      count: 0,
      error: false
    }
  }

  componentDidMount() {
    this.loadAudioList(this.state.page);
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

    let promise = fetch(`http://localhost:8080/api/audio?${query}`, {
      method: 'get'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({
        audioArr: data.music,
        hasNextPage: data.hasNextPage,
        count: data.count,
        page,
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

  loadAudio = audio => {
    this.setState({ audioReady: false });

    let promise = fetch(`http://localhost:8080/api/audio/${audio._id}`, {
      method: 'get'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({
        audioData: data,
        audioReady: true
      }))
      .catch(err => {
        this.setState({ audioReady: true })
        console.log(err)
      });
  }

  choosePage = (event, page) => {
    event.preventDefault();
    this.loadAudioList(page);
  }

  render() {
    const {
      audioArr,
      newAudio,
      count,
      hasNextPage,
      page,
      limitPerPage,
      audioListReady,
      audioData,
      error
    } = this.state;

    if(error) return (
      <Alert color="danger">
        При завантажені даних сталася помилка
      </Alert>
    )

    let pageItems = [];
    for(let index = 0; index <= (count / limitPerPage); index++) {
      pageItems.push(
        <PaginationItem
          active={index === page}
          key={index}
          onClick={e => this.choosePage(event, index)}
        >
          <PaginationLink href="#">
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Fragment>
        <div className="margin-wrapper">
          <h2>Аудіо</h2>
          <div className="right">
            <Button
              color={newAudio ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => this.setState({ newAudio: !newAudio })}
            >
              {newAudio ? 'Відмінити' : 'Завантажити'}
            </Button>
          </div>
        </div>

        <div className="divider"></div>

        <Row>
          <Col xs="8">
            <div className="margin-wrapper">
              <ReactPlaceholder
                showLoadingAnimation
                ready={audioListReady}
                customPlaceholder={(
                  <div className="empty-message">
                    <InfinityLoaderSVG style={{'margin': '0 auto', 'width': '240px'}} />
                  </div>
                )}
              >
                <AudioList
                  audioArr={audioArr}
                  onChoseAudio={audio => this.loadAudio(audio)}
                />
              </ReactPlaceholder>
            </div>

            {count > limitPerPage && <Pagination>{pageItems}</Pagination>}
          </Col>
          <Col>
            {audioData._id && (
              <Form>
                <FormGroup>
                  <Label for="title">Назва</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={audioData.title}
                    onChange={e => {
                      let data = audioData;
                      data.title = e.target.value
                      this.setState({ audioData: data })
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="artist">Виконавець</Label>
                  <Input type="text" name="artist" id="artist" />
                </FormGroup>
                <FormGroup>
                  <Label for="album">Альбом</Label>
                  <Input type="text" name="album" id="album" />
                </FormGroup>
              </Form>
            )}
          </Col>
        </Row>
        

        <div className="divider"></div>

      </Fragment>
    );
  }
}

const AudioList = props => {
  return(
    <Fragment>
      {
        props.audioArr.map((audio, index) => {
          return(
            <div key={index} className="clearfix">
              <MusicItem
                currentId={'ddd'}
                audio={audio}
                isPlaying={false}
                isLoading={false}
                onChoseAudio={props.onChoseAudio}
              />
            </div>
          )
        })
      }
    </Fragment>
  );
}