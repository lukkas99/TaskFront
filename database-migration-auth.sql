-- ============================================
-- SCRIPT DE MIGRAÇÃO - SISTEMA DE AUTENTICAÇÃO
-- Task Manager - Autenticação de Usuários
-- ============================================

-- 1. CRIAÇÃO DA TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE Users (
	Id INT PRIMARY KEY IDENTITY(1,1),
	Name NVARCHAR(200) NOT NULL,
	Email NVARCHAR(200) NOT NULL UNIQUE,
	PasswordHash NVARCHAR(500) NOT NULL,
	CreatedAt DATETIME2 DEFAULT GETDATE(),
	UpdatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE INDEX IX_Users_Email ON Users(Email);

-- 2. ALTERAÇÃO DA TABELA DE TASKS
-- ============================================
-- Adiciona coluna UserId às tasks existentes
ALTER TABLE Tasks
ADD UserId INT NULL;

-- Adiciona foreign key
ALTER TABLE Tasks
ADD CONSTRAINT FK_Tasks_Users 
	FOREIGN KEY (UserId) 
	REFERENCES Users(Id)
	ON DELETE CASCADE;

-- Cria índice para melhor performance
CREATE INDEX IX_Tasks_UserId ON Tasks(UserId);

-- 3. DADOS DE TESTE (OPCIONAL)
-- ============================================
-- Senha: "123456" (hash exemplo - NO BACKEND USE BCRYPT!)
-- Hash BCrypt de "123456": $2a$10$xZQqR3VZ5zY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y

INSERT INTO Users (Name, Email, PasswordHash) VALUES 
('João Silva', 'joao@email.com', '$2a$10$xZQqR3VZ5zY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y'),
('Maria Santos', 'maria@email.com', '$2a$10$xZQqR3VZ5zY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y');

-- 4. ATUALIZAÇÃO DE TASKS EXISTENTES (OPCIONAL)
-- ============================================
-- Se você já tem tasks e quer associá-las a um usuário de teste:
-- UPDATE Tasks SET UserId = 1 WHERE UserId IS NULL;

-- 5. TORNAR UserId OBRIGATÓRIO (APÓS MIGRAÇÃO)
-- ============================================
-- Depois de migrar todas as tasks existentes, torne o campo obrigatório:
-- ALTER TABLE Tasks
-- ALTER COLUMN UserId INT NOT NULL;

-- ============================================
-- QUERIES ÚTEIS
-- ============================================

-- Listar todos os usuários
SELECT * FROM Users;

-- Listar tasks com informações do usuário
SELECT 
	t.Id,
	t.Title,
	t.IsCompleted,
	t.Category,
	t.Priority,
	u.Name AS UserName,
	u.Email AS UserEmail
FROM Tasks t
LEFT JOIN Users u ON t.UserId = u.Id;

-- Contar tasks por usuário
SELECT 
	u.Name,
	u.Email,
	COUNT(t.Id) AS TotalTasks,
	SUM(CASE WHEN t.IsCompleted = 1 THEN 1 ELSE 0 END) AS CompletedTasks
FROM Users u
LEFT JOIN Tasks t ON u.Id = t.UserId
GROUP BY u.Id, u.Name, u.Email;
