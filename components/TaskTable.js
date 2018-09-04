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
      if (Array.isArray(nextProps.tableData)) {
        this.setState({
          data: _.uniqBy([...nextProps.tableData], 'id')
        });
      }
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

  dataPaging = (data, page) => data.slice((page - 1) * 4, page * 4);

  render() {
    const { column, data, direction } = this.state;
    const { Header, Row, HeaderCell } = Table;

    return (
      <Table sortable celled>
        <Header>
          <Row>
            <HeaderCell />
            <HeaderCell
              sorted={column === 'id' ? direction : null}
              onClick={this.handleSort('id')}
            >
              ID
            </HeaderCell>
            <HeaderCell
              sorted={column === 'task' ? direction : null}
              onClick={this.handleSort('task')}
            >
              Task
            </HeaderCell>
            <HeaderCell
              sorted={column === 'createdAt' ? direction : null}
              onClick={this.handleSort('createdAt')}
              textAlign="right"
            >
              CreatedAt
            </HeaderCell>
            <HeaderCell
              sorted={column === 'modifiedAt' ? direction : null}
              onClick={this.handleSort('modifiedAt')}
              textAlign="right"
            >
              ModifiedAt
            </HeaderCell>
            <HeaderCell />
          </Row>
        </Header>
        {_.map(
          this.dataPaging(data, this.props.page),
          ({ task, id, createdAt, isCompleted, refTask, modifiedAt }) => (
            <TaskRow
              key={id}
              id={id}
              task={task}
              createdAt={createdAt}
              modifiedAt={modifiedAt}
              isCompleted={isCompleted}
              refTask={refTask}
              onEdit={id => this.props.onEdit(id)}
              onComplete={id => this.props.onComplete(id)}
              page={this.props.page}
            />
          )
        )}
      </Table>
    );
  }
}

export default TaskTable;
