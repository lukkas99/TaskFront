import { useState } from "react";
import TaskItem from "./TaskItem";

/**
 * Componente de lista de tarefas
 * Responsabilidade: Renderização da lista de tarefas
 */
function TaskList({ tasks, onToggleTask, onDeleteTask, onReorderTasks }) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);

  if (tasks.length === 0) {
    return (
      <div style={{ 
        textAlign: "center", 
        padding: "2rem", 
        color: "#999" 
      }}>
        Nenhuma tarefa cadastrada. Adicione uma tarefa acima!
      </div>
    );
  }

  const pendingTasks = tasks.filter(task => !task.done);
  const completedTasks = tasks.filter(task => task.done);

  const handleDragStart = (index, section) => {
    setDraggedIndex(index);
    setDraggedSection(section);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex, section) => {
    if (draggedIndex === null || draggedSection !== section) return;

    const currentList = section === "pending" ? pendingTasks : completedTasks;
    const reorderedList = [...currentList];
    const [draggedItem] = reorderedList.splice(draggedIndex, 1);
    reorderedList.splice(dropIndex, 0, draggedItem);

    const otherList = section === "pending" ? completedTasks : pendingTasks;
    const newTasks = section === "pending" 
      ? [...reorderedList, ...otherList]
      : [...otherList, ...reorderedList];

    onReorderTasks(newTasks);
    setDraggedIndex(null);
    setDraggedSection(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDraggedSection(null);
  };

  return (
    <div className="task-list-container">
      {pendingTasks.length > 0 && (
        <section>
          <h2>Pendentes ({pendingTasks.length})</h2>
          <ul className="task-list">
            {pendingTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                section="pending"
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index && draggedSection === "pending"}
              />
            ))}
          </ul>
        </section>
      )}

      {completedTasks.length > 0 && (
        <section>
          <h2>Concluídas ({completedTasks.length})</h2>
          <ul className="task-list">
            {completedTasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                section="completed"
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index && draggedSection === "completed"}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default TaskList;