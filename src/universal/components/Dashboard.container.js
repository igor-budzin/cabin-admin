import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import cx from 'classnames';

@connect(mapStateToProps, mapDispatchToProps)
export default class DashboardContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    }
  }


  render() {
    return (
      <p>DashBoard</p>
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