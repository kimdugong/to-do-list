import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Dropdown, Input, Pagination, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import TaskTable from '../components/TaskTable';

class TodoList extends Component {
  state = {
    data: [],
    onEdit: false,
    task: '',
    childTask: [],
    onEditId: null
  };
  constructor(props, context) {
    super(props, context);
    this.data = [];
  }
  async componentDidMount() {
    const { data } = await axios.get('/todo');
    const sortedByCreatedAt = _.sortBy(data, ['createdAt', 'asec']);
    this.data = sortedByCreatedAt;
    this.setState({ data: sortedByCreatedAt });
  }

  onEdit = id => {
    event.preventDefault();
    this.setState({ onEdit: true, onEditId: id });
    const item = _.find(this.state.data, data => data.id === id);
    this.setState({ task: item.task, childTask: item.childTask });
  };

  onCancle = () => {
    event.preventDefault();
    this.setState({ onEdit: false, task: '', childTask: [], onEditId: null });
  };

  onCreate = async () => {
    event.preventDefault();
    if (!this.state.task) return console.log('task is required');
    const { task, childTask } = this.state;
    const { data } = await axios.post('/todo', {
      task,
      childTask
    });
    this.setState(prev => ({ data: [...prev.data, data] }));
    this.onCancle();
  };

  onUpdate = async id => {
    event.preventDefault();
    const item = _.find(this.state.data, data => data.id === id);
    const { task, childTask } = this.state;
    item.task = task;
    item.childTask = childTask;
    const { data } = await axios.post(`/todo/${id}`, item);
    console.log('update axios data  : ', data);
    this.setState(prev => ({
      data: [
        ...prev.data.map(item => {
          return item.id === id
            ? {
                ...item,
                task: data.task,
                childTask: data.childTask,
                isCompleted: data.isCompleted,
                modifiedAt: data.modifiedAt
              }
            : item;
        })
      ]
    }));
    this.onCancle();
  };

  render() {
    return (
      <Layout>
        <Input
          fluid
          placeholder="Make a todo list not war..."
          value={this.state.task}
          onChange={event => this.setState({ task: event.target.value })}
        />
        <Dropdown
          fluid
          position="right"
          placeholder="참조하기"
          multiple
          search
          selection
          options={this.state.data
            .filter(e => {
              if (e) return e.id !== this.state.onEditId;
            })
            .map(task => {
              const option = {
                key: task.id,
                value: task.id,
                text: `@${task.id} ${task.task}`
              };
              return option;
            })}
          onChange={(event, data) => {
            this.setState({ childTask: [...data.value] });
          }}
          value={this.state.childTask}
          style={{ marginTop: 10 }}
        />

        <Button.Group
          style={{ marginTop: 10, marginBottom: 50, display: 'flex' }}
        >
          {!this.state.onEdit ? (
            <Button primary onClick={this.onCreate}>
              Save
            </Button>
          ) : (
            <Button
              secondary
              onClick={() => this.onUpdate(this.state.onEditId)}
            >
              Update
            </Button>
          )}

          <Button onClick={this.onCancle}>Cancel</Button>
        </Button.Group>

        <TaskTable tableData={this.state.data} onEdit={id => this.onEdit(id)} />

        <Pagination
          defaultActivePage={1}
          firstItem={null}
          lastItem={null}
          totalPages={1}
          pointing
          secondary
          style={{
            margin: 'auto',
            display: 'flex',
            justifyContent: 'center'
          }}
        />
      </Layout>
    );
  }
}

export default TodoList;
