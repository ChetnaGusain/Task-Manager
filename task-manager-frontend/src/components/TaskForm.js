import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, endTime, priority };

    try {
      await axios.post("http://localhost:5000/api/tasks", taskData);
      fetchTasks(); // Fetch tasks after adding
      setTitle("");
      setEndTime("");
      setPriority(1);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 rounded shadow bg-light"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <h2 className="mb-4 text-center">Add New Task</h2>
      <div className="mb-3">
        <label className="form-label">Task Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">End Time</label>
        <input
          type="datetime-local"
          className="form-control"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Priority</label>
        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          required
        >
          {[1, 2, 3, 4, 5].map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
