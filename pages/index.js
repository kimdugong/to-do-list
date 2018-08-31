import React, { Component } from 'react';
import { Card, Input, Pagination } from 'semantic-ui-react';
import Layout from '../components/Layout';
import TaskTable from '../components/TaskTable';
import axios from 'axios';

class TodoList extends Component {
  state = {
    data: []
  };
  async componentDidMount() {
    const { data } = await axios.get('/todo');
    this.setState(prev => ({ data: [...prev.data, ...data] }));
  }

  render() {
    return (
      <Layout>
        <Input
          fluid
          action={{ icon: 'pencil alternate' }}
          placeholder="Make a todo list not war..."
        />

        <TaskTable tableData={this.state.data} />

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
