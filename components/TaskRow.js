import React, { Component } from 'react';
import { Table, Tab, Icon } from 'semantic-ui-react';

class TaskRow extends Component {
  state = {
    isCompleted: false
  };
  renderChildTask = childTaskArray =>
    childTaskArray.map(id => `@ ${id}`).join(' ');

  toggleComplete = state => {
    this.setState({ isCompleted: !state });
  };

  componentDidMount() {
    this.setState({ isCompleted: this.props.isCompleted });
  }

  render() {
    const { Row, Cell, Body } = Table;
    const { id, task, createdAt, childTask, modifiedAt } = this.props;
    const { isCompleted } = this.state;
    return (
      <Body>
        <Row key={id}>
          {!isCompleted ? (
            <Cell selectable textAlign="center">
              <a onClick={() => this.toggleComplete(isCompleted)}>
                <Icon name="square outline" />
              </a>
            </Cell>
          ) : (
            <Cell selectable textAlign="center" positive>
              <a onClick={() => this.toggleComplete(isCompleted)}>
                <Icon name="check square outline" />
              </a>
            </Cell>
          )}

          <Cell>{id}</Cell>
          <Cell>{`${task}  ${this.renderChildTask(childTask)}`}</Cell>
          <Cell textAlign="right">{new Date(createdAt).toLocaleString()}</Cell>
          <Cell textAlign="right">
            {modifiedAt ? new Date(modifiedAt).toLocaleString() : '-'}
          </Cell>
          <Cell selectable textAlign="center">
            <a onClick={() => this.props.onEdit(id)}>Edit</a>
          </Cell>
        </Row>
      </Body>
    );
  }
}

export default TaskRow;
