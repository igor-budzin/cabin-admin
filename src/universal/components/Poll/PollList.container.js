import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import ReactPlaceholder from 'react-placeholder';
import {
  Table, Button, Col, Row, Spinner,
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
      pollForDelete: false,
      deleteLoading: false,
      errorDelete: false
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

  onDeletePoll = poll => {
    this.setState({ pollForDelete: poll });
    this.toggleModalDelete();
  }

  toggleModalDelete = () => this.setState({ showModalDelete: !this.state.showModalDelete })

  handleDelete = () => {
    this.setState({ deleteLoading: true });

    let promise = fetch(`http://localhost:8080/api/poll/${this.state.pollForDelete.alias}`, {
      method: 'delete'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => {
        this.setState({
          showModalDelete: false,
          deleteLoading: false,
          pollForDelete: false
        });
      })
      .catch(err => {
        this.setState({
          showModalDelete: false,
          deleteLoading: false,
          pollForDelete: false
        });
        console.log(err)
      });
  }

  render() {
    const {
      pollArr,
      count,
      hasNextPage,
      page,
      limitPerPage,
      pollListReady,
      pollData,
      error,
      pollForDelete,
      deleteLoading,
      showModalDelete
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
          backdrop={true}
          isOpen={this.state.showModalDelete}
          toggle={this.toggleModalDelete}
          onExit={() => this.setState({ pollForDelete: false })}
        >
          <ModalHeader>Видалити голосування</ModalHeader>
          <ModalBody>
            Ви впевнені що хочете видалити голосування <b>{pollForDelete.title}</b>?
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleDelete}>
              {deleteLoading && <span><Spinner className="spinner-offset" size="sm" color="light" /></span>}
              Так, видалити
            </Button>
            <Button
              color="secondary"
              onClick={this.toggleModalDelete}
              disabled={deleteLoading}
            >
              Скасувати
            </Button>
          </ModalFooter>
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
                      <DropdownItem className="text-danger" onClick={() => props.onDeletePoll(poll)}>
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