import { useState } from "react";
import { TaskCategory, TaskPriority, CategoryLabels, PriorityLabels } from "../domain/enums/TaskEnums";

/**
 * Componente de formulário para adicionar tarefas
 * Responsabilidade: Captura e validação de input do usuário
 */
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(TaskCategory.OTHER);
  const [priority, setPriority] = useState(TaskPriority.MEDIUM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTask(title.trim(), category, priority);
      setTitle("");
      setCategory(TaskCategory.OTHER);
      setPriority(TaskPriority.MEDIUM);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nova tarefa..."
        disabled={isSubmitting}
        maxLength={200}
      />

      <select
        value={category}
        onChange={(e) => setCategory(Number(e.target.value))}
        disabled={isSubmitting}
      >
        {Object.entries(CategoryLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
        disabled={isSubmitting}
      >
        {Object.entries(PriorityLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <button 
        type="submit" 
        disabled={isSubmitting || !title.trim()}
      >
        {isSubmitting ? "Adicionando..." : "Adicionar"}
      </button>
    </form>
  );
}

export default TaskForm;