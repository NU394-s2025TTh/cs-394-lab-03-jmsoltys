// src/components/TodoList.tsx

import React, { useState } from 'react';
import { useEffect } from 'react';

import { Todo } from '../types/todo-type';

interface TodoListProps {
  onSelectTodo: (id: number) => void;
}

interface FetchTodosParams {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

type FilterOptions = 'All' | 'Open' | 'Completed';

/**
 * fetchTodos function fetches todos from the API and updates the state.
 * @param setTodos - React setState Function to set the todos state.
 * @param setFilteredTodos - React setState Function to set the filtered todos state.
 * @param setLoading - react setState Function to set the loading state.
 * @param setError - react setState Function to set the error state.
 *
 * @returns {Promise<void>} - A promise that resolves when the todos are fetched and state is updated.  You should call this in useEffect.
 * setup useEffect to call this function when the component mounts
 * wraps the fetch API call in a try-catch block to handle errors gracefully and update the loading and error states accordingly.
 * The function uses async/await syntax to handle asynchronous operations, making the code cleaner and easier to read.
 * fetch from the URL https://jsonplaceholder.typicode.com/todos
 */
// remove eslint-disable-next-line @typescript-eslint/no-unused-vars when you use the parameters in the function
export const fetchTodos = async ({
  setTodos,
  setFilteredTodos,
  setLoading,
  setError,
}: FetchTodosParams): Promise<void> => {
  try {
    setLoading(true);

    const todosResponse = await fetch('https://jsonplaceholder.typicode.com/todos');
    let todos: Todo[];

    if (!todosResponse.ok) {
      throw new Error(`HTTP error! Status: ${todosResponse.status}`);
    } else {
      todos = await todosResponse.json();
      setTodos(todos);
      setFilteredTodos(todos);
    }

    setLoading(false);
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Unknown error when attempting to fetch todos.');
    }
  }
};

export function filterTodos(
  todos: Todo[],
  filterCriteria: FilterOptions,
  setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
): void {
  let filteredTodos: Todo[] = todos.slice(0);

  if (filterCriteria === 'Open') {
    filteredTodos = todos.filter((todo) => !todo.completed);
  } else if (filterCriteria === 'Completed') {
    filteredTodos = todos.filter((todo) => todo.completed);
  } else {
    filteredTodos = todos;
  }

  setFilteredTodos(filteredTodos);
}

/**
 * TodoList component fetches todos from the API and displays them in a list.
 * It also provides filter buttons to filter the todos based on their completion status.
 * @param onSelectTodo - A function that is called when a todo is selected. It receives the todo id as an argument.
 * @returns
 */
// remove the following line when you use onSelectTodo in the component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TodoList: React.FC<TodoListProps> = ({ onSelectTodo }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  const [filterCriteria, setFilterCriteria] = useState<FilterOptions>('All');

  useEffect(() => {
    fetchTodos({ setTodos, setFilteredTodos, setLoading, setError });
  }, []);

  useEffect(() => {
    filterTodos(todos, filterCriteria, setFilteredTodos);
  }, [todos, filterCriteria]);

  return (
    <div className="todo-list">
      <h2>Todo List</h2>
      <p>
        These are the filter buttons. The tests depend on the data-testids; and use
        provided styles. Implement click event handlers to change the filter state and
        update the UI accordingly to show just those todo&apos;s. other hints: you can
        change the styling of the button with <code>className</code> property. if the
        className of a button is &quot;active&quot; it will use the{' '}
        <code> .todo-button.completed</code> CSS style in App.css
      </p>
      <div className="filter-buttons">
        <button data-testid="filter-all" onClick={() => setFilterCriteria('All')}>
          All
        </button>
        <button data-testid="filter-open" onClick={() => setFilterCriteria('Open')}>
          Open
        </button>
        <button
          data-testid="filter-completed"
          onClick={() => setFilterCriteria('Completed')}
        >
          Completed
        </button>
      </div>
      <p>
        Show a list of todo&apos;s here. Make it so if you click a todo it calls the event
        handler onSelectTodo with the todo id to show the individual todo
      </p>
      {loading && <p>/loading todos/i</p>}
      {error && <p>Error loading todos: {error}</p>}
      {filteredTodos.map((todo: Todo) => (
        <div key={todo.id}>
          <button onClick={() => onSelectTodo(todo.id)}>Todo {todo.id}</button>
        </div>
      ))}
    </div>
  );
};
