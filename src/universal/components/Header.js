import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

export default class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {

    }
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Navbar color="light" light expand="md">
              <NavbarBrand href="/">Cabin of Pilot</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <Link to="/users" className="nav-link">
                      Користувачі
                    </Link>
                  </NavItem>

                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                      Музика
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Link to="/collection">
                        <DropdownItem>
                          Колекції
                        </DropdownItem>
                      </Link>
                      <Link to="/singer">
                        <DropdownItem>
                          Виконавці
                        </DropdownItem>
                      </Link>
                      <Link to="/audio">
                        <DropdownItem>
                          Аудіо
                        </DropdownItem>
                      </Link>
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
    );
  }
}
