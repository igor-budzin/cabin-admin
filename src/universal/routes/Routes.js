// Libraries
import React, { Component, Fragment } from  'react';
import { Route, Redirect, Switch } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AnimatedSwitch } from 'react-router-transition';

import 'universal/assets/styles/bootstrap.min.scss';
import styles from 'universal/assets/styles/styles.scss';

import RootContainer from 'universal/components/Root.container';

// For Development only
import * as RouteMap from '../routes/static.js';
// This is used in production for code splitting via `wepback.config.server.js`
// import * as RouteMap from 'universal/routes/async.js';

const PrivateRoute = ({ component: Component, isAuthenticated, location, prevPath, ...rest }) => {
  if(location.pathname !== '/login') {
    return (
      <Route prevPath={prevPath} {...rest} render={props => {
          return (
            true ?
            (<Component {...props} prevPath={prevPath} location={location} />) :
            (<Redirect to={{pathname: '/login', state: { from: props.location }}} />)
          )
        }}
      />
    )
  }
  else return null;
}

@connect(mapStateToProps)
export default class Routes extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      prevPath: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({ prevPath: this.props.location.pathname })
    }
  }

  render() {
    const { location, isAuthenticated = true } = this.props;
    return (
      <RootContainer>
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className="switch-wrapper"
        >
          <PrivateRoute exact path="/" component={RouteMap.Dashboard} {...this.props} {...this.state} />
          <PrivateRoute exact path="/users" component={RouteMap.Users} {...this.props} {...this.state} />
          <PrivateRoute exact path="/audio" component={RouteMap.Audio} {...this.props} {...this.state} />
          <PrivateRoute exact path="/collection" component={RouteMap.Collection} {...this.props} {...this.state} />
{/*          <Route exact path='/login' component={RouteMap.LoginPage} {...this.props} />
          <Route exact path='/register' component={RouteMap.RegisterPage} {...this.props} />*/}
          <Route exact component={RouteMap.NotFound} {...this.props} />
        </AnimatedSwitch>
      </RootContainer>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    // isAuthenticated: state.AuthReducer.isAuthenticated
  };
}
