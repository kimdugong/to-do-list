import React, { Component } from 'react';
import { Card, Input, Pagination } from 'semantic-ui-react';
import Layout from '../components/Layout';
import TaskTable from '../components/TaskTable';

class TodoList extends Component {
  render() {
    return (
      <Layout>
        <Input
          fluid
          action={{ icon: 'pencil alternate' }}
          placeholder="Make a todo list not war..."
        />

        <TaskTable />

        <Pagination
          defaultActivePage={1}
          firstItem={null}
          lastItem={null}
          pointing
          secondary
          totalPages={1}
        />
      </Layout>
    );
  }
}

export default TodoList;
