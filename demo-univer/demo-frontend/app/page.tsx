"use client"; // Mark this as a Client Component

import { useState, useEffect } from "react";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks from the backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get<Task[]>("http://localhost:8080/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Add a new task
  const addTask = async () => {
    if (!title || !description) {
      alert("Please fill in both title and description.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/tasks", { title, description });
      fetchTasks(); // Refresh the task list
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      fetchTasks(); // Refresh the task list
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Start editing a task
  const startEditing = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
  };

  // Update a task
  const updateTask = async () => {
    if (!editingTask || !title || !description) {
      alert("Please fill in both title and description.");
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/tasks/${editingTask.id}`, {
        title,
        description,
      });
      fetchTasks(); // Refresh the task list
      setEditingTask(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
      <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
        <main className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Task Manager
          </h1>

          {/* Add/Edit Task Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingTask ? "Edit Task" : "Add Task"}
            </h2>
            <div className="flex flex-col space-y-4">
              <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <button
                  onClick={editingTask ? updateTask : addTask}
                  className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {editingTask ? "Update Task" : "Add Task"}
              </button>
              {editingTask && (
                  <button
                      onClick={() => {
                        setEditingTask(null);
                        setTitle("");
                        setDescription("");
                      }}
                      className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel Edit
                  </button>
              )}
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Tasks
            </h2>
            <ul className="space-y-4">
              {tasks.map((task) => (
                  <li
                      key={task.id}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {task.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                          onClick={() => startEditing(task)}
                          className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                          onClick={() => deleteTask(task.id)}
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
  );
}