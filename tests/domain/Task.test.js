import { describe, it, expect } from 'vitest';
import { Task } from '../../src/domain/entities/Task';

describe('Task Entity', () => {
  describe('constructor', () => {
    it('deve criar uma tarefa com valores corretos', () => {
      const task = new Task(1, 'Test Task', false);

      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      expect(task.done).toBe(false);
    });

    it('deve criar uma tarefa com done=false por padrão', () => {
      const task = new Task(1, 'Test Task');

      expect(task.done).toBe(false);
    });
  });

  describe('fromApiResponse', () => {
    it('deve criar tarefa a partir de resposta da API', () => {
      const apiData = { id: 1, title: 'API Task', done: true };
      const task = Task.fromApiResponse(apiData);

      expect(task.id).toBe(1);
      expect(task.title).toBe('API Task');
      expect(task.done).toBe(true);
    });
  });

  describe('toApiRequest', () => {
    it('deve converter para formato da API', () => {
      const task = new Task(1, 'Test Task', true);
      const apiRequest = task.toApiRequest();

      expect(apiRequest).toEqual({
        title: 'Test Task',
        done: true,
      });
    });
  });

  describe('toggle', () => {
    it('deve alternar de não concluída para concluída', () => {
      const task = new Task(1, 'Test Task', false);
      const toggled = task.toggle();

      expect(toggled.done).toBe(true);
    });

    it('deve alternar de concluída para não concluída', () => {
      const task = new Task(1, 'Test Task', true);
      const toggled = task.toggle();

      expect(toggled.done).toBe(false);
    });

    it('deve retornar nova instância sem modificar original', () => {
      const task = new Task(1, 'Test Task', false);
      const toggled = task.toggle();

      expect(task.done).toBe(false);
      expect(toggled.done).toBe(true);
    });
  });

  describe('isValid', () => {
    it('deve retornar true para tarefa válida', () => {
      const task = new Task(1, 'Valid Task', false);

      expect(task.isValid()).toBe(true);
    });

    it('deve retornar false para título vazio', () => {
      const task = new Task(1, '', false);

      expect(task.isValid()).toBe(false);
    });

    it('deve retornar false para título com apenas espaços', () => {
      const task = new Task(1, '   ', false);

      expect(task.isValid()).toBe(false);
    });

    it('deve retornar false para título null', () => {
      const task = new Task(1, null, false);

      expect(task.isValid()).toBe(false);
    });
  });
});
