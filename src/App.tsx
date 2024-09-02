import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    const content = window.prompt("Enter Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (

        
    <Authenticator>
      {({ signOut,user }) => (
            <main>
               <h1>{user?.signInDetails?.loginId}'s todos</h1>
              <button onClick={createTodo}>+ New Todo</button>
              <div className="todo-list">
                <div className="todo-header">
                  <span>Reg. No.</span>
                  <span>Content</span>
                  <span>Actions</span>
                </div>
                {todos.map((todo, index) => (
                  <div className="todo-item" key={todo.id}>
                    <span>{index + 1}</span>
                    <span>{todo.content}</span>
                    <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                  </div>
                ))}
              </div>

              <button onClick={signOut}>Sign out</button>
            </main>
        
      )}
      </Authenticator>
  );
}

export default App;
