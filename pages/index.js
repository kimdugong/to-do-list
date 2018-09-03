import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
  Dropdown,
  Input,
  Pagination,
  Button,
  Message
} from 'semantic-ui-react';
import Layout from '../components/Layout';
import TaskTable from '../components/TaskTable';

class TodoList extends Component {
  state = {
    data: [],
    onEdit: false,
    task: '',
    childTask: [],
    onEditId: null,
    errorMessage: '',
    undoChildren: [],
    page: 1
  };

  async componentDidMount() {
    const { data } = await axios.get('/todo');
    const sortedByCreatedAt = _.sortBy(data, ['createdAt', 'asec']);
    this.setState({ data: sortedByCreatedAt });
  }

  onEdit = id => {
    event.preventDefault();
    const { task, childTask } = _.find(this.state.data, data => data.id === id);
    this.setState({
      task,
      childTask,
      undoChildren: [],
      onEdit: true,
      onEditId: id,
      errorMessage: ''
    });
  };

  onCancel = () => {
    event.preventDefault();
    this.setState({
      task: '',
      childTask: [],
      undoChildren: [],
      onEdit: false,
      onEditId: null,
      errorMessage: ''
    });
  };

  onCreate = async () => {
    event.preventDefault();
    const { task, childTask } = this.state;
    if (!task) {
      return this.setState({ errorMessage: '할일을 적어주세요' });
    }
    const { data } = await axios.post('/todo', {
      task,
      childTask
    });
    this.setState(prev => ({ data: [...prev.data, data] }));
    this.onCancel();
  };

  onUpdate = async id => {
    event.preventDefault();
    const item = _.find(this.state.data, data => data.id === id);
    const { task, childTask } = this.state;
    item.task = task;
    item.childTask = childTask;
    const { data } = await axios.post(`/todo/${id}`, item);
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
    this.onCancel();
  };

  onComplete = async id => {
    event.preventDefault();
    this.setState({ errorMessage: '', undoChildren: [] });
    const item = _.find(this.state.data, data => data.id === id);
    item.isCompleted = !item.isCompleted;
    try {
      console.log('item.isCompleted', item.isCompleted);
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
      return data.isCompleted;
    } catch (error) {
      item.isCompleted = !item.isCompleted;
      if (error.response.data.childTask) {
        const { childTask } = error.response.data;
        const undoChildren = childTask.map(
          undoChild => `@${undoChild.id} ${undoChild.task}`
        );
        this.setState({
          errorMessage: '아래 할일 부터 완료해야 완료가 가능합니다.',
          undoChildren
        });
        return false;
      }
      return item.isCompleted;
    }
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
          placeholder="참조할 리스트를 검색하세요"
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
          style={{ marginTop: 10, marginBottom: 20, display: 'flex' }}
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

          <Button onClick={this.onCancel}>Cancel</Button>
        </Button.Group>
        {this.state.errorMessage ? (
          <Message
            error
            header={this.state.errorMessage}
            list={this.state.undoChildren}
          />
        ) : null}

        <TaskTable
          tableData={this.state.data}
          onEdit={id => this.onEdit(id)}
          onComplete={id => this.onComplete(id)}
          page={this.state.page}
        />

        <Pagination
          defaultActivePage={1}
          firstItem={null}
          lastItem={null}
          totalPages={this.state.data.length / 4}
          pointing
          secondary
          style={{
            margin: 'auto',
            display: 'flex',
            justifyContent: 'center'
          }}
          size={'mini'}
          onPageChange={(event, data) =>
            this.setState({ page: data.activePage })
          }
        />
      </Layout>
    );
  }
}

export default TodoList;
