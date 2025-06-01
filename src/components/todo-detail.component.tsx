// src/components/TodoDetail.tsx

import React, { useEffect } from 'react';

import { Todo } from '../types/todo-type';

interface TodoDetailProps {
  todoId: number;
}

interface FetchTodoParams {
  todoId: number;
  setTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const fetchTodo = async ({
  todoId,
  setTodo,
  setLoading,
  setError,
}: FetchTodoParams): Promise<void> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } else {
      const todo = await response.json();
      setTodo(todo);
      setLoading(false);
    }
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message);
    } else {
      setError('Unknown error when attempting to fetch todos.');
    }
    setLoading(false);
  }
};

/**
 * TodoDetail component fetches and displays the details of a specific todo item based on the provided todoId.
 * It uses the useEffect hook to fetch the todo details from the API when the component mounts or when the todoId changes.
 * @param todoId - The ID of the todo item to fetch and display.
 */
export const TodoDetail: React.FC<TodoDetailProps> = ({ todoId }) => {
  const [todo, setTodo] = React.useState<Todo | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  console.log('todo:', todo);
  console.log('loading:', loading);
  console.log('error:', error);

  useEffect(() => {
    fetchTodo({ todoId, setTodo, setLoading, setError });
  }, [todoId]);

  return (
    <div className="todo-detail">
      <h2>Todo Details</h2>
      {todo && (
        <div>
          <h1>Todo {todoId}</h1>
          <h2>Title: {todo.title}</h2>
          <h2>Completed</h2>
          <p>{todo.completed ? 'Completed' : 'Open'} Todo</p>
        </div>
      )}
    </div>
  );
};
