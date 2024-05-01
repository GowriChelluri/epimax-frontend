import React, { Component } from 'react';
import './App.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompleteScreen: false,
      allTodos: [],
      newTitle: '',
      newDescription: '',
      completedTodos: [],
      currentEdit: "",
      currentEditedItem: ""
    };
  }

  handleAddTodo = () => {
    const { newTitle, newDescription } = this.state;

    // Validate input fields
    if (!newTitle.trim()) {
      this.setState({ titleError: 'Title is required' });
      return;
    }
    if (!newDescription.trim()) {
      this.setState({ descriptionError: 'Description is required' });
      return;
    }

    // Reset error messages
    this.setState({ titleError: '', descriptionError: '' });

    let newTodoItem = {
      title: this.state.newTitle,
      description: this.state.newDescription,
    };

    let updatedTodoArr = [...this.state.allTodos];
    updatedTodoArr.push(newTodoItem);
    this.setState({ allTodos: updatedTodoArr });
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
  };

  handleDeleteTodo = index => {
    let reducedTodo = [...this.state.allTodos];
    reducedTodo.splice(index);

    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    this.setState({ allTodos: reducedTodo });
  };

  handleComplete = index => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth() + 1;
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let completedOn =
      dd + '-' + mm + '-' + yyyy + ' at ' + h + ':' + m + ':' + s;

    let filteredItem = {
      ...this.state.allTodos[index],
      completedOn: completedOn,
    };

    let updatedCompletedArr = [...this.state.completedTodos];
    updatedCompletedArr.push(filteredItem);
    this.setState({ completedTodos: updatedCompletedArr });
    this.handleDeleteTodo(index);
    localStorage.setItem(
      'completedTodos',
      JSON.stringify(updatedCompletedArr)
    );
  };

  handleDeleteCompletedTodo = index => {
    let reducedTodo = [...this.state.completedTodos];
    reducedTodo.splice(index);

    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    this.setState({ completedTodos: reducedTodo });
  };

  componentDidMount() {
    let savedTodo = JSON.parse(localStorage.getItem('todolist'));
    let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
    if (savedTodo) {
      this.setState({ allTodos: savedTodo });
    }

    if (savedCompletedTodo) {
      this.setState({ completedTodos: savedCompletedTodo });
    }
  }

  handleEdit = (ind, item) => {
    console.log(ind);
    this.setState({ currentEdit: ind, currentEditedItem: item });
  }

  handleUpdateTitle = (value) => {
    this.setState(prevState => ({
      currentEditedItem: { ...prevState.currentEditedItem, title: value }
    }));
  }

  handleUpdateDescription = (value) => {
    this.setState(prevState => ({
      currentEditedItem: { ...prevState.currentEditedItem, description: value }
    }));
  }

  handleUpdateToDo = () => {
    let newToDo = [...this.state.allTodos];
    newToDo[this.state.currentEdit] = this.state.currentEditedItem;
    this.setState({ allTodos: newToDo, currentEdit: "" });
  }

  render() {
    const {
      newTitle,
      newDescription,
      titleError,
      descriptionError,
      isCompleteScreen,
      allTodos,
      completedTodos,
      currentEdit,
      currentEditedItem,
    } = this.state;
    return (
      <div className="App">
        <h1>My Todos</h1>

        <div className="todo-wrapper">
          <div className="todo-input">
            <div className="todo-input-item">
              <label>Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => this.setState({ newTitle: e.target.value })}
                placeholder="What's the task title?"
              />
              {titleError && <span className="error">{titleError}</span>}
            </div>
            <div className="todo-input-item">
              <label>Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) =>
                  this.setState({ newDescription: e.target.value })
                }
                placeholder="What's the task description?"
              />
              {descriptionError && (
                <span className="error">{descriptionError}</span>
              )}
            </div>
            <div className="todo-input-item">
              <button
                type="button"
                onClick={this.handleAddTodo}
                className="primaryBtn"
              >
                Add
              </button>
            </div>
          </div>

          <div className="btn-area">
            <button
              className={`secondaryBtn ${this.state.isCompleteScreen === false && 'active'}`}
              onClick={() => this.setState({ isCompleteScreen: false })}
            >
              Todo
            </button>
            <button
              className={`secondaryBtn ${this.state.isCompleteScreen === true && 'active'}`}
              onClick={() => this.setState({ isCompleteScreen: true })}
            >
              Completed
            </button>
          </div>

          <div className="todo-list">

            {this.state.isCompleteScreen === false &&
              this.state.allTodos.map((item, index) => {
                if (this.state.currentEdit === index) {
                  return (
                    <div className='edit__wrapper' key={index}>
                      <input placeholder='Updated Title'
                        onChange={(e) => this.handleUpdateTitle(e.target.value)}
                        value={this.state.currentEditedItem.title} />
                      <textarea placeholder='Updated Title'
                        rows={4}
                        onChange={(e) => this.handleUpdateDescription(e.target.value)}
                        value={this.state.currentEditedItem.description} />
                      <button
                        type="button"
                        onClick={this.handleUpdateToDo}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  )
                } else {
                  return (
                    <div className="todo-list-item" key={index}>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>

                      <div>
                        <AiOutlineDelete
                          className="icon"
                          onClick={() => this.handleDeleteTodo(index)}
                          title="Delete?"
                        />
                        <BsCheckLg
                          className="check-icon"
                          onClick={() => this.handleComplete(index)}
                          title="Complete?"
                        />
                        <AiOutlineEdit className="check-icon"
                          onClick={() => this.handleEdit(index, item)}
                          title="Edit?" />
                      </div>

                    </div>
                  );
                }

              })}

            {this.state.isCompleteScreen === true &&
              this.state.completedTodos.map((item, index) => {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <p><small>Completed on: {item.completedOn}</small></p>
                    </div>

                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => this.handleDeleteCompletedTodo(index)}
                        title="Delete?"
                      />
                    </div>

                  </div>
                );
              })}

          </div>
        </div>
      </div>
    );
  }
}

export default App;
