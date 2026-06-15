import { useState } from "react";

/**
 * Componente de formulário para adicionar tarefas
 * Responsabilidade: Captura e validação de input do usuário
 */
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTask(title.trim());
      setTitle("");
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