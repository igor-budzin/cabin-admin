import React, { Component, Fragment } from 'react';
import cx from 'classnames';
import CollectionSection from 'universal/sections/CollectionSection';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, } from 'reactstrap';

export default class CollectionAdd extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      title: '',
      subtitle: '',
      cover: ''
    }
  }

  onAddImage = event => {
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = event => {
        this.setState({ cover: event.target.result })
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onCreateCollection = () => {
    const { title, subtitle, cover } = this.state;

    const data = new FormData();

    if(title && subtitle && cover) {
      data.append('title', title);
      data.append('subtitle', subtitle);
      data.append("files", document.getElementById('cover').files[0]);

      this.props.handleCreateCollection(data);
    }
  }


  render() {
    const { title, subtitle, cover } = this.state;

    return (
      <Form>
        <Row form>
          <Col md={12} lg={6}>
            <FormGroup>
              <Label for="title">Заголовок 1</Label>
              <Input onChange={e => this.setState({ title: e.target.value })} type="text" name="title" id="title" placeholder="Краще від" />
            </FormGroup>
            <FormGroup>
              <Label for="subtitle">Заголовок 2</Label>
              <Input onChange={e => this.setState({ subtitle: e.target.value })} type="text" name="subtitle" id="subtitle" placeholder="Олега Винника" />
            </FormGroup>
            <FormGroup>
              <Label for="cover">Обкладинка</Label>
              <Input onChange={this.onAddImage} type="file" name="cover" id="cover" />
              <FormText color="muted">
                Оптимальний розмір 246х210
              </FormText>
            </FormGroup>
            <FormGroup>
              <Button
                color="primary"
                onClick={this.onCreateCollection}
              >
                Додати
              </Button>
            </FormGroup>
          </Col>
          <Col md={12} lg={6}>
            <div style={{"width": '480px', "margin": '0 auto'}}>
              <CollectionSection {...this.state} />
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}