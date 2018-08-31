import React, { Component } from 'react';
import { Table, Tab } from 'semantic-ui-react';

class TaskRow extends Component {
  render() {
    const { Row, Cell, Body } = Table;
    const { id, task, timestamp } = this.props;
    return (
      <Body>
        <Row key={id}>
          <Cell>{id}</Cell>
          <Cell>{task}</Cell>
          <Cell>{new Date(timestamp).toLocaleTimeString()}</Cell>
        </Row>
      </Body>
    );
  }
}

export default TaskRow;
