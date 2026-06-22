import { useState } from "react";
import { container } from "./infrastructure/config/dependencies";
import { useAuth } from "./hooks/useAuth";
import { useTasks } from "./hooks/useTasks";
import Login from "./components/Login";
import Register from "./components/Register";
import UserHeader from "./components/UserHeader";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskFilters from "./components/TaskFilters";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import "./App.css";

/**
 * Componente principal da aplicação
 * Responsabilidade: Composição e coordenação dos componentes
 * Segue o princípio KISS - mantém simplicidade delegando responsabilidades
 */
function App() {
  const authService = container.getAuthService();
  const taskService = container.getTaskService();

  const { user, loading: authLoading, login, register, logout, isAuthenticated } = useAuth(authService);
  const { tasks, loading, error, addTask, toggleTask, deleteTask, reloadTasks, reorderTasks } = 
    useTasks(taskService);

  const [showRegister, setShowRegister] = useState(false);
  const [filters, setFilters] = useState({ category: null, priority: null });

  // Mostra loading enquanto verifica autenticação
  if (authLoading) {
    return <LoadingSpinner message="Verificando autenticação..." />;
  }

  // Se não estiver autenticado, mostra tela de login/cadastro
  if (!isAuthenticated) {
    return showRegister ? (
      <Register
        onRegister={register}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        onLogin={login}
        onSwitchToRegister={() => setShowRegister(true)}
      />
    );
  }

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filters.category !== null && task.category !== filters.category) {
      return false;
    }
    if (filters.priority !== null && task.priority !== filters.priority) {
      return false;
    }
    return true;
  });

  if (loading) {
    return <LoadingSpinner message="Carregando suas tarefas..." />;
  }

  return (
    <div className="app-container">
      <header>
        <UserHeader user={user} onLogout={logout} />
        <h1>Minhas Tarefas</h1>
      </header>

      <main>
        <ErrorMessage message={error} onRetry={reloadTasks} />

        <div className="form-filters-container">
          <TaskForm onAddTask={addTask} />
          <TaskFilters onFilterChange={handleFilterChange} />
        </div>

        <TaskList 
          tasks={filteredTasks}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
          onReorderTasks={reorderTasks}
        />
      </main>
    </div>
  );
}

export default App;