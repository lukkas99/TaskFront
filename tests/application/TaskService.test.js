import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskService } from '../../src/application/services/TaskService';
import { Task } from '../../src/domain/entities/Task';

describe('TaskService', () => {
  let mockRepository;
  let taskService;

  beforeEach(() => {
    mockRepository = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    taskService = new TaskService(mockRepository);
  });

  describe('getAllTasks', () => {
    it('deve retornar todas as tarefas do repositório', async () => {
      const tasks = [
        new Task(1, 'Task 1', false),
        new Task(2, 'Task 2', true),
      ];
      mockRepository.getAll.mockResolvedValue(tasks);

      const result = await taskService.getAllTasks();

      expect(result).toEqual(tasks);
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createTask', () => {
    it('deve criar uma tarefa válida', async () => {
      const title = 'New Task';
      const createdTask = new Task(1, title, false);
      mockRepository.create.mockResolvedValue(createdTask);

      const result = await taskService.createTask(title);

      expect(result).toEqual(createdTask);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });

    it('deve lançar erro para título vazio', async () => {
      await expect(taskService.createTask('')).rejects.toThrow(
        'Tarefa inválida: o título não pode estar vazio'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('deve lançar erro para título com apenas espaços', async () => {
      await expect(taskService.createTask('   ')).rejects.toThrow(
        'Tarefa inválida: o título não pode estar vazio'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('toggleTask', () => {
    it('deve alternar status da tarefa', async () => {
      const task = new Task(1, 'Task', false);
      const toggledTask = new Task(1, 'Task', true);
      mockRepository.update.mockResolvedValue(toggledTask);

      const result = await taskService.toggleTask(1, task);

      expect(result.done).toBe(true);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteTask', () => {
    it('deve deletar tarefa', async () => {
      mockRepository.delete.mockResolvedValue();

      await taskService.deleteTask(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
