import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect } from 'react-router';
import cx from 'classnames';
import {
  Container,
  Row,
  Col,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';


@connect(mapStateToProps, mapDispatchToProps)
export default class RootContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    }
  }


  render() {
    return (
      <Fragment>
        <Container>
          <Row>
            <Col>
              <Navbar color="light" light expand="md">
                <NavbarBrand href="/">Cabin of Pilot</NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink href="/users">Користувачі</NavLink>
                    </NavItem>

                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Музика
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          <NavLink href="/collection">Колекції</NavLink>
                        </DropdownItem>
                        <DropdownItem>
                          Плейлисти
                        </DropdownItem>
                        <DropdownItem>
                          Треки
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>

                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Афіша
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          Option 1
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>

                    <UncontrolledDropdown nav inNavbar>
                      <DropdownToggle nav caret>
                        Блог
                      </DropdownToggle>
                      <DropdownMenu right>
                        <DropdownItem>
                          Option 1
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </Nav>
                </Collapse>
              </Navbar>
            </Col>
          </Row>
        </Container>

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

function mapStateToProps(state, props) {
  return {
    // currentUserId: state.AuthReducer.user.id
  };
}

function mapDispatchToProps(dispatch, props) {
  return {}
  // return bindActionCreators(AuthAction, dispatch);
}