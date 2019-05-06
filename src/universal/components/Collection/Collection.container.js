import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import cx from 'classnames';
import CollectionSection from 'universal/sections/CollectionSection';
import CollectionAdd from './CollectionAdd';
import { Table, Button, Form, FormGroup, Label, Input, FormText, Col, Row } from 'reactstrap';

export default class CollectionContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      collectionArr: [],
      newCollection: false
    }
  }

  componentDidMount() {
    let promise = fetch('http://localhost:8080/api/collection', {
      method: 'get'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({ collectionArr: data.collections }))
      .catch(err => console.log(err));
  }

  handleCreateCollection = collectionData => {
    let promise = fetch('http://localhost:8080/api/collection', {
      method: 'post',
      body: collectionData,
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({ collectionArr: data }))
      .catch(err => console.log(err));
  }

  render() {
    const { collectionArr, newCollection } = this.state;

    return (
      <Fragment>
        <div className="margin-wrapper">
          <h2>Колекції</h2>
          <div className="right">
            <Button
              color="primary"
              size="sm"
              onClick={() => this.setState({ newCollection: !newCollection })}
            >
              {newCollection ? 'Відмінити' : 'Додати'}
            </Button>
          </div>
        </div>

        <div className="divider"></div>

        {
          newCollection ?
          <CollectionAdd handleCreateCollection={this.handleCreateCollection} /> :
          <CollectionList collectionArr={collectionArr} />
        }
      </Fragment>
    );
  }
}

const CollectionList = props => {
  return(
    <Fragment>
      {props.collectionArr.length > 0 ?
      <Table striped className="custom-table">
        <thead>
          <tr>
            <th>title</th>
            <th>subtitle</th>
          </tr>
        </thead>
        <tbody>
          {props.collectionArr.map(collection => {
            return(
              <tr key={collection._id}>
                <td>{collection.title}</td>
                <td>{collection.subtitle}</td>
              </tr>
            )
          })}
        </tbody>
      </Table> :
      <div className="margin-wrapper">
        <div className="empty-message">Немає жодної колекції</div>
      </div>}
    </Fragment>
  );
}