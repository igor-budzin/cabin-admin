import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import cx from 'classnames';
import { Table, UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

@connect(mapStateToProps, mapDispatchToProps)
export default class UsersContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      userArr: []
    }
  }

  componentDidMount() {
    let promise = fetch('http://localhost:8080/api/user', {
      method: 'get'
    });

    promise
      .then(response => {
        if(response.ok) {
          return response.json();
        }
      })
      .then(data => this.setState({ userArr: data }))
      .catch(err => console.log(err));
  }


  render() {
    const { userArr } = this.state;

    return (
      <Table striped className="custom-table">
        <thead>
          <tr>
            <th>id</th>
            <th>Name</th>
            <th>email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            userArr.map(user => {
              return(
                <tr key={user.id}>
                  <th scope="row">{user.id}</th>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <UncontrolledButtonDropdown className="right">
                      <DropdownToggle caret color="primary" size="sm">
                        Опції
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem>Редагувати</DropdownItem>
                        <DropdownItem className="text-danger">
                          Видалити
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    // currentUserId: state.AuthReducer.user.id
  };
}

function mapDispatchToProps(dispatch, props) {
  return {}
  // return bindActionCreators(AuthAction, dispatch);
}