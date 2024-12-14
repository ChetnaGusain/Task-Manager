import React, { useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";

const TaskList = ({ tasks, fetchTasks }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const markAsFinished = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "finished", endTime: new Date() }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error marking task as finished:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/tasks/${currentTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentTask),
      });
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length ? (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.priority}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.startTime).toLocaleString()}</td>
                  <td>{task.endTime ? new Date(task.endTime).toLocaleString() : "N/A"}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setCurrentTask(task);
                        setShowModal(true);
                      }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="me-2"
                      onClick={() => markAsFinished(task._id)}
                    >
                      Finish
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No tasks available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                value={currentTask?.title || ""}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, title: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={currentTask?.endTime || ""}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, endTime: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                value={currentTask?.priority || 1}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, priority: e.target.value })
                }
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Update Task
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaskList;
