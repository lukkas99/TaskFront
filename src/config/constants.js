/**
 * Constantes de configuração da aplicação
 * Princípio: Single Source of Truth
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5340",
  TIMEOUT: 10000,
};

export const VALIDATION_RULES = {
  TASK_TITLE_MIN_LENGTH: 1,
  TASK_TITLE_MAX_LENGTH: 200,
};

export const MESSAGES = {
  LOADING: "Carregando...",
  NO_TASKS: "Nenhuma tarefa cadastrada",
  ERROR_LOADING: "Erro ao carregar tarefas",
  ERROR_CREATING: "Erro ao criar tarefa",
  ERROR_UPDATING: "Erro ao atualizar tarefa",
  ERROR_DELETING: "Erro ao excluir tarefa",
  CONFIRM_DELETE: "Deseja realmente excluir esta tarefa?",
};
