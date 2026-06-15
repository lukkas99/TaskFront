import { container } from "./infrastructure/config/dependencies";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import "./App.css";

/**
 * Componente principal da aplicação
 * Responsabilidade: Composição e coordenação dos componentes
 * Segue o princípio KISS - mantém simplicidade delegando responsabilidades
 */
function App() {
  const taskService = container.getTaskService();
  const { tasks, loading, error, addTask, toggleTask, deleteTask, reloadTasks, reorderTasks } = 
    useTasks(taskService);

  if (loading) {
    return <LoadingSpinner message="Carregando suas tarefas..." />;
  }

  return (
    <div className="app-container">
      <header>
        <h1>Minhas Tarefas</h1>
      </header>

      <main>
        <ErrorMessage message={error} onRetry={reloadTasks} />

        <TaskForm onAddTask={addTask} />

        <TaskList 
          tasks={tasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onReorderTasks={reorderTasks}
        />
      </main>
    </div>
  );
}

export default App;