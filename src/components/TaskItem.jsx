import Badge from "./Badge";
import { CategoryLabels, PriorityLabels, CategoryColors, PriorityColors } from "../domain/enums/TaskEnums";
import { MdDeleteOutline } from "react-icons/md";

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
      <div className="task-checkbox">
        <button 
          className="btn-toggle" 
          onClick={handleToggle}
          aria-label={task.done ? "Marcar como não concluída" : "Marcar como concluída"}
        >
          {task.done ? "✅" : "⬜"}
        </button>
      </div>

      <div className="task-title-wrapper">
        <span className="task-title">{task.title}</span>
      </div>

      <div className="task-badges">
        <Badge 
          label={CategoryLabels[task.category]} 
          color={CategoryColors[task.category]} 
        />
        <Badge 
          label={PriorityLabels[task.priority]} 
          color={PriorityColors[task.priority]} 
        />
      </div>

      <div className="task-actions">
        <button 
          className="btn-delete" 
          onClick={handleDelete}
          aria-label="Excluir tarefa"
        >
          <MdDeleteOutline size={20} />
        </button>
      </div>
    </li>
  );
}

export default TaskItem;