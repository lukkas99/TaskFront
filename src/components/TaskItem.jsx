/**
 * Componente de item de tarefa
 * Responsabilidade: Apresentação de uma tarefa individual
 */
function TaskItem({ 
  task, 
  index, 
  section, 
  onToggle, 
  onDelete, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  onDragEnd,
  isDragging 
}) {
  const handleToggle = () => {
    onToggle(task.id);
  };

  const handleDelete = () => {
    if (window.confirm(`Deseja realmente excluir a tarefa "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const handleDragStart = (e) => {
    onDragStart(index, section);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    onDragOver(e);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    onDrop(index, section);
  };

  const handleDragEnd = () => {
    onDragEnd();
  };

  return (
    <li 
      className={`task-item ${task.done ? "task-done" : ""} ${isDragging ? "dragging" : ""}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      style={{ cursor: "move" }}
    >
      <span className="task-title">{task.title}</span>
      <div className="task-actions">
        <button 
          className="btn-toggle" 
          onClick={handleToggle}
          aria-label={task.done ? "Marcar como não concluída" : "Marcar como concluída"}
        >
          {task.done ? "✅" : "⬜"}
        </button>
        <button 
          className="btn-delete" 
          onClick={handleDelete}
          aria-label="Excluir tarefa"
        >
          🗑️
        </button>
      </div>
    </li>
  );
}

export default TaskItem;