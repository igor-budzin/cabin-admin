import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import {
  Table, Button, Form, FormGroup, Label, Input, FormText, Col, Row,
  UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import InfinityLoaderSVG from 'universal/sections/InfinityLoaderSVG';

export default class DashboardContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      pollArr: [],
      pollListReady: true,
      pollReady: true,
      pollData: {},
      limitPerPage: 30,
      page: 0,
      count: 0,
      error: false,
      showModalDelete: false,

      
    }
  }

  componentDidMount() {
    this.loadPollList(this.state.page);
  }

  loadPollList(page) {
    this.setState({ pollListReady: false });

    let params = {
      "page": parseInt(page + 1, 10),
      "limit": parseInt(this.state.limitPerPage, 10)
    };
    let query = Object.keys(params)
     .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
     .join('&');

    let promise = fetch(`http://localhost:8080/api/poll?${query}`, {
      method: 'get'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({
        pollArr: data.poll,
        hasNextPage: data.hasNextPage,
        count: data.count,
        page,
        pollListReady: true
      }))
      .catch(err => {
        this.setState({
          pollListReady: true,
          error: true
        })
        console.log(err)
      });
  }

  onDeletePoll = alias => {
    
  }

  toggleModalDelete = () => this.setState({ modal: !this.state.modal })

  render() {
    const {
      pollArr,
      count,
      hasNextPage,
      page,
      limitPerPage,
      pollListReady,
      pollData,
      error
    } = this.state;

    return (
      <Fragment>
        <div className="margin-wrapper">
          <h2>Голосування</h2>
          <div className="right">
            <Link to="/poll/add">
              <Button color="primary" size="sm">Додати</Button>
            </Link>
          </div>
        </div>

        <div className="divider"></div>

        <div className="margin-wrapper">
          <ReactPlaceholder
            showLoadingAnimation
            ready={pollListReady}
            customPlaceholder={(
              <div className="empty-message">
                <InfinityLoaderSVG style={{'margin': '0 auto', 'width': '240px'}} />
              </div>
            )}
          >
            <PollList
              pollArr={pollArr}
              onChosepoll={poll => this.loadpoll(poll)}
              onDeletePoll={this.onDeletePoll}
            />
          </ReactPlaceholder>
          {count > limitPerPage && <Pagination>{pageItems}</Pagination>}
        </div>

        <Modal
          centered
          isOpen={this.state.showModalDelete}
          toggle={this.toggleModalDelete}
        >
          <ModalHeader>Видалити голосування</ModalHeader>
          <ModalBody>

          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

const PollList = props => {
  return(
    <Fragment>
      {props.pollArr.length > 0 ?
      <Table hover striped className="custom-table">
        <thead>
          <tr>
            <th>title</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.pollArr.map(poll => {
            return(
              <tr key={poll._id}>
                <td>{poll.title}</td>
                <td>
                  <UncontrolledButtonDropdown className="right">
                    <DropdownToggle caret color="primary" size="sm">
                      Опції
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem>Редагувати</DropdownItem>
                      <DropdownItem className="text-danger" onClick={props.onDeletePoll}>
                        Видалити
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table> :
      <div className="margin-wrapper">
        <div className="empty-message">Немає жодного голосування</div>
      </div>}
    </Fragment>
  );
}