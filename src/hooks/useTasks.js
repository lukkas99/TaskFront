import { useState, useEffect, useCallback } from "react";

/**
 * Hook customizado para gerenciar tarefas
 * Responsabilidade: Gerenciamento de estado e side effects
 * Segue o princípio de Single Responsibility
 */
export function useTasks(taskService) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      try {
        setLoading(true);
        setError(null);
        const loadedTasks = await taskService.getAllTasks();
        if (!cancelled) {
          setTasks(loadedTasks);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          console.error("Erro ao carregar tarefas:", err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      cancelled = true;
    };
  }, [taskService]);

  const reloadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedTasks = await taskService.getAllTasks();
      setTasks(loadedTasks);
    } catch (err) {
      setError(err.message);
      console.error("Erro ao carregar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }, [taskService]);

  const addTask = useCallback(
    async (title, category, priority) => {
      try {
        setError(null);
        const newTask = await taskService.createTask(title, category, priority);
        setTasks((prevTasks) => [...prevTasks, newTask]);
        return newTask;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [taskService]
  );

  const toggleTask = useCallback(
    async (taskId) => {
      try {
        setError(null);
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        const updatedTask = await taskService.toggleTask(taskId, task);
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t.id === taskId ? updatedTask : t))
        );
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [taskService, tasks]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        setError(null);
        await taskService.deleteTask(taskId);
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [taskService]
  );

  const reorderTasks = useCallback((reorderedTasks) => {
    setTasks(reorderedTasks);
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
    reloadTasks,
    reorderTasks,
  };
}
