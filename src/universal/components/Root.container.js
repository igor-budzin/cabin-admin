import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

import Header from './Header';

export default class RootContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    }
  }

  render() {
    return (
      <Fragment>

        <Header />
        <Container>
          <Row>
            <Col>
              <div className="content">
                {this.props.children}
              </div>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}
