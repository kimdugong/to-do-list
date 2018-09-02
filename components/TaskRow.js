import React, { Component } from 'react';
import { Table, Tab, Icon } from 'semantic-ui-react';

class TaskRow extends Component {
  state = {
    isCompleted: false
  };
  renderChildTask = childTaskArray =>
    childTaskArray.map(id => `@ ${id}`).join(' ');

  toggleComplete = async id => {
    const isCompleted = await this.props.onComplete(id, isCompleted);
    this.setState({ isCompleted });
  };

  componentDidMount() {
    this.setState({ isCompleted: this.props.isCompleted });
  }

  render() {
    const { Row, Cell, Body } = Table;
    const { id, task, createdAt, childTask, modifiedAt, page } = this.props;
    const { isCompleted } = this.state;
    return (
      <Body>
        <Row key={id}>
          {!isCompleted ? (
            <Cell selectable textAlign="center">
              <a onClick={() => this.toggleComplete(id)}>
                <Icon name="square outline" />
              </a>
            </Cell>
          ) : (
            <Cell selectable textAlign="center" positive>
              <a onClick={() => this.toggleComplete(id)}>
                <Icon name="check square outline" />
              </a>
            </Cell>
          )}

          <Cell disabled={isCompleted}>{id}</Cell>
          <Cell disabled={isCompleted}>{`${task}  ${this.renderChildTask(
            childTask
          )}`}</Cell>
          <Cell textAlign="right" disabled={isCompleted}>
            {new Date(createdAt).toLocaleString()}
          </Cell>
          <Cell textAlign="right" disabled={isCompleted}>
            {modifiedAt ? new Date(modifiedAt).toLocaleString() : '-'}
          </Cell>
          <Cell selectable textAlign="center" disabled={isCompleted}>
            <a onClick={() => this.props.onEdit(id)}>Edit</a>
          </Cell>
        </Row>
      </Body>
    );
  }
}

export default TaskRow;
