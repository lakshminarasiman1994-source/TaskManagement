import { useEffect, useState } from "react";
import api from "./services/api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  const [showModal, setShowModal] = useState(false);

  const [viewTask, setViewTask] = useState(null);

  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    getTasks();
  }, []);

  // GET ALL TASKS
  const getTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // CREATE TASK
  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      await api.post("/tasks", {
        title,
        description,
        status,
      });

      setTitle("");
      setDescription("");
      setStatus("pending");

      setShowModal(false);

      getTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // VIEW TASK
  const handleView = async (taskId) => {
    try {
      const response = await api.get(`/tasks/${taskId}`);

      setViewTask(response.data);
    } catch (error) {
      console.error("Error viewing task:", error);
    }
  };

  // OPEN EDIT MODAL
  const handleEdit = (task) => {
    setEditTask(task);

    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
  };

  // UPDATE TASK
  const updateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      await api.put(`/tasks/${editTask.id}`, {
        title,
        description,
        status,
      });

      setEditTask(null);

      setTitle("");
      setDescription("");
      setStatus("pending");

      getTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // DELETE TASK
  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);

      getTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // CLOSE MODAL
  const closeModal = () => {
    setShowModal(false);
    setEditTask(null);

    setTitle("");
    setDescription("");
    setStatus("pending");
  };

  // STATISTICS
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const progressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">✓</div>
          <span>TaskFlow</span>
        </div>

        <nav className="sidebar-nav">

          <div className="nav-item active">
            <span>▦</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>✓</span>
            Tasks
          </div>

          <div className="nav-item">
            <span>◷</span>
            Activity
          </div>

        </nav>

        <div className="sidebar-bottom">

          <div className="nav-item">
            <span>⚙</span>
            Settings
          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* HEADER */}
        <header className="topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              Manage and track your tasks efficiently.
            </p>
          </div>

          <button
            className="add-button"
            onClick={() => setShowModal(true)}
          >
            <span>+</span>
            Add Task
          </button>

        </header>


        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-info">
              <span className="stat-label">
                Total Tasks
              </span>

              <strong>{totalTasks}</strong>
            </div>

            <div className="stat-icon blue">
              ✓
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-info">
              <span className="stat-label">
                Pending
              </span>

              <strong>{pendingTasks}</strong>
            </div>

            <div className="stat-icon orange">
              ◷
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-info">
              <span className="stat-label">
                In Progress
              </span>

              <strong>{progressTasks}</strong>
            </div>

            <div className="stat-icon purple">
              ↻
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-info">
              <span className="stat-label">
                Completed
              </span>

              <strong>{completedTasks}</strong>
            </div>

            <div className="stat-icon green">
              ✓
            </div>

          </div>

        </section>


        {/* TASK SECTION */}
        <section className="task-section">

          <div className="section-header">

            <div>
              <h2>All Tasks</h2>

              <p>
                View and manage your tasks.
              </p>
            </div>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search tasks..."
              />
            </div>

          </div>


          {/* TABLE */}
          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>TASK</th>
                  <th>DESCRIPTION</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>

              </thead>


              <tbody>

                {tasks.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty-state"
                    >
                      No tasks found
                    </td>

                  </tr>

                ) : (

                  tasks.map((task) => (

                    <tr key={task.id}>

                      <td className="task-id">
                        #{task.id}
                      </td>

                      <td>

                        <div className="task-title">
                          {task.title}
                        </div>

                      </td>

                      <td>

                        <div className="task-description">
                          {task.description ||
                            "No description"}
                        </div>

                      </td>

                      <td>

                        <span
                          className={`status-badge ${task.status}`}
                        >

                          <span className="status-dot"></span>

                          {task.status === "in-progress"
                            ? "In Progress"
                            : task.status
                                .charAt(0)
                                .toUpperCase() +
                              task.status.slice(1)}

                        </span>

                      </td>

                      <td>

                        <div className="actions">

                          {/* VIEW */}
                          <button
                            className="action-button view"
                            onClick={() =>
                              handleView(task.id)
                            }
                          >
                            View
                          </button>


                          {/* EDIT */}
                          <button
                            className="action-button edit"
                            onClick={() =>
                              handleEdit(task)
                            }
                          >
                            Edit
                          </button>


                          {/* DELETE */}
                          <button
                            className="action-button delete"
                            onClick={() =>
                              handleDelete(task.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </section>

      </main>


      {/* CREATE / EDIT MODAL */}
      {(showModal || editTask) && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editTask
                    ? "Edit Task"
                    : "Create New Task"}
                </h2>

                <p>
                  {editTask
                    ? "Update your task details."
                    : "Add a new task to your workspace."}
                </p>

              </div>

              <button
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>


            <form
              onSubmit={
                editTask
                  ? updateTask
                  : createTask
              }
            >

              <div className="form-group">

                <label>
                  Task Title
                </label>

                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

              </div>


              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >

                  <option value="pending">
                    Pending
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                </select>

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                >
                  {editTask
                    ? "Update Task"
                    : "Create Task"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* VIEW TASK MODAL */}
      {viewTask && (

        <div
          className="modal-overlay"
          onClick={() => setViewTask(null)}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Task Details
                </h2>

                <p>
                  View complete task information.
                </p>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setViewTask(null)
                }
              >
                ×
              </button>

            </div>


            <div className="form-group">

              <label>
                Task ID
              </label>

              <p>
                #{viewTask.id}
              </p>

            </div>


            <div className="form-group">

              <label>
                Title
              </label>

              <p>
                {viewTask.title}
              </p>

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <p>
                {viewTask.description ||
                  "No description"}
              </p>

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <p>
                {viewTask.status}
              </p>

            </div>


            <div className="modal-actions">

              <button
                className="cancel-button"
                onClick={() =>
                  setViewTask(null)
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;