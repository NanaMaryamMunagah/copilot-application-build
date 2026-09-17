import { useEffect, useMemo, useState } from 'react'
import './App.css'

const initialTasks = [
  { id: 1, text: 'Plan the day', completed: false },
  { id: 2, text: 'Review pull requests', completed: true },
  { id: 3, text: 'Write follow-up email', completed: false },
]

const FILTERS = {
  all: 'All',
  active: 'Active',
  completed: 'Completed',
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('task-app-tasks')
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('task-app-tasks', JSON.stringify(tasks))
  }, [tasks])

  const visibleTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed)
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.completed)
    }

    return tasks
  }, [filter, tasks])

  const remainingCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - remainingCount

  const addTask = (event) => {
    event.preventDefault()

    const trimmed = draft.trim()
    if (!trimmed) return

    setTasks((currentTasks) => [
      { id: Date.now() + Math.random(), text: trimmed, completed: false },
      ...currentTasks,
    ])
    setDraft('')
  }

  const toggleTask = (id) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((currentTasks) => currentTasks.filter((task) => !task.completed))
  }

  return (
    <main className="app-shell">
      <section className="task-card">
        <header className="topbar">
          <div>
            <p className="eyebrow">Productivity</p>
            <h1>Today&apos;s tasks</h1>
          </div>

          <div className="stats" aria-label="Task summary">
            <span>{remainingCount} left</span>
            <span>{completedCount} done</span>
          </div>
        </header>

        <form className="task-form" onSubmit={addTask}>
          <input
            aria-label="Task name"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a task"
          />
          <button type="submit" disabled={!draft.trim()}>
            Add
          </button>
        </form>

        <div className="toolbar">
          {Object.entries(FILTERS).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={filter === value ? 'is-active' : ''}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}

          <button
            type="button"
            className="link-button"
            onClick={clearCompleted}
            disabled={completedCount === 0}
          >
            Clear completed
          </button>
        </div>

        <ul className="task-list" aria-live="polite">
          {visibleTasks.length > 0 ? (
            visibleTasks.map((task) => (
              <li key={task.id} className={task.completed ? 'task-item completed' : 'task-item'}>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <span>{task.text}</span>
                </label>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className="empty-state">No tasks match this filter.</li>
          )}
        </ul>
      </section>
    </main>
  )
}

export default App
