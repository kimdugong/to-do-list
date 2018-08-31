import React, { Component } from 'react';
import { Table, Tab } from 'semantic-ui-react';

class TaskRow extends Component {
  render() {
    const { Row, Cell, Body } = Table;
    const { name, age, gender } = this.props;
    return (
      <Body>
        <Row key={name}>
          <Cell>{name}</Cell>
          <Cell>{age}</Cell>
          <Cell>{gender}</Cell>
        </Row>
      </Body>
    );
  }
}

export default TaskRow;
