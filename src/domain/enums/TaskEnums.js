/**
 * Enum de Categoria da Tarefa
 * Sincronizado com TaskCategory do backend
 */
export const TaskCategory = {
  WORK: 0,
  PERSONAL: 1,
  STUDY: 2,
  OTHER: 3,
};

/**
 * Enum de Prioridade da Tarefa
 * Sincronizado com TaskPriority do backend
 */
export const TaskPriority = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
};

/**
 * Labels para exibição de categorias
 */
export const CategoryLabels = {
  [TaskCategory.WORK]: "Trabalho",
  [TaskCategory.PERSONAL]: "Pessoal",
  [TaskCategory.STUDY]: "Estudos",
  [TaskCategory.OTHER]: "Outros",
};

/**
 * Labels para exibição de prioridades
 */
export const PriorityLabels = {
  [TaskPriority.LOW]: "Baixa",
  [TaskPriority.MEDIUM]: "Média",
  [TaskPriority.HIGH]: "Alta",
};

/**
 * Cores para badges de categoria
 */
export const CategoryColors = {
  [TaskCategory.WORK]: "#3b82f6",      // blue
  [TaskCategory.PERSONAL]: "#8b5cf6",  // purple
  [TaskCategory.STUDY]: "#10b981",     // green
  [TaskCategory.OTHER]: "#6b7280",     // gray
};

/**
 * Cores para badges de prioridade
 */
export const PriorityColors = {
  [TaskPriority.LOW]: "#f8df54",    // green
  [TaskPriority.MEDIUM]: "#f59e0b", // amber
  [TaskPriority.HIGH]: "#ef4444",   // red
};
