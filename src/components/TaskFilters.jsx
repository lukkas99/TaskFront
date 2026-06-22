import { CategoryLabels, PriorityLabels } from "../domain/enums/TaskEnums";

/**
 * Componente de filtros para tarefas
 * Responsabilidade: Filtrar tarefas por categoria e prioridade
 */
function TaskFilters({ onFilterChange }) {
  const handleCategoryChange = (e) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    onFilterChange({ category: value });
  };

  const handlePriorityChange = (e) => {
    const value = e.target.value === "" ? null : Number(e.target.value);
    onFilterChange({ priority: value });
  };

  const handleClearFilters = () => {
    onFilterChange({ category: null, priority: null });
    document.getElementById("category-filter").value = "";
    document.getElementById("priority-filter").value = "";
  };

  return (
    <div className="task-filters">
      <div className="filters-row">
        <select id="category-filter" onChange={handleCategoryChange}>
          <option value="">📁 Categoria</option>
          {Object.entries(CategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <select id="priority-filter" onChange={handlePriorityChange}>
          <option value="">⚡ Prioridade</option>
          {Object.entries(PriorityLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <button className="btn-clear-filters" onClick={handleClearFilters} title="Limpar filtros">
          🔄
        </button>
      </div>
    </div>
  );
}

export default TaskFilters;
