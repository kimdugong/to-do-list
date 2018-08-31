import _ from 'lodash';
import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';

import TaskRow from './TaskRow';

class TaskTable extends Component {
  state = {
    column: null,
    data: [],
    direction: null
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.tableData !== this.props.tableData) {
      this.setState(prev => ({ data: [...prev.data, ...nextProps.tableData] }));
    }
  }

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending'
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    });
  };

  render() {
    const { column, data, direction } = this.state;

    return (
      <Table sortable celled fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === 'name' ? direction : null}
              onClick={this.handleSort('name')}
            >
              ID
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'age' ? direction : null}
              onClick={this.handleSort('age')}
            >
              Task
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={column === 'gender' ? direction : null}
              onClick={this.handleSort('gender')}
            >
              CreatedAt
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        {_.map(data, ({ task, id, timestamp }) => (
          <TaskRow key={id} id={id} task={task} timestamp={timestamp} />
        ))}
      </Table>
    );
  }
}

export default TaskTable;
