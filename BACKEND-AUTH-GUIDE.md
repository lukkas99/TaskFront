# 🔐 GUIA DE IMPLEMENTAÇÃO - BACKEND DE AUTENTICAÇÃO

Este guia contém as instruções para implementar o backend de autenticação no seu projeto ASP.NET Core.

## 📋 Pré-requisitos

1. Execute o script SQL `database-migration-auth.sql` no seu banco de dados
2. Instale os pacotes NuGet necessários:

```bash
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package System.IdentityModel.Tokens.Jwt
dotnet add package BCrypt.Net-Next
```

## 📁 Estrutura de Arquivos a Criar

```
Backend/
├── Models/
│   ├── User.cs
│   ├── LoginRequest.cs
│   ├── RegisterRequest.cs
│   └── AuthResponse.cs
├── Services/
│   ├── IAuthService.cs
│   └── AuthService.cs
├── Controllers/
│   └── AuthController.cs
└── appsettings.json (atualizar)
```

## 1️⃣ Modelo User.cs

```csharp
namespace TaskManager.Models
{
	public class User
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string PasswordHash { get; set; } = string.Empty;
		public DateTime CreatedAt { get; set; }
		public DateTime UpdatedAt { get; set; }

		// Navegação
		public ICollection<TaskItem>? Tasks { get; set; }
	}
}
```

## 2️⃣ DTOs (Data Transfer Objects)

**LoginRequest.cs**
```csharp
namespace TaskManager.Models
{
	public class LoginRequest
	{
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}
}
```

**RegisterRequest.cs**
```csharp
namespace TaskManager.Models
{
	public class RegisterRequest
	{
		public string Name { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Password { get; set; } = string.Empty;
	}
}
```

**AuthResponse.cs**
```csharp
namespace TaskManager.Models
{
	public class AuthResponse
	{
		public string Token { get; set; } = string.Empty;
		public UserDto User { get; set; } = null!;
	}

	public class UserDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
	}
}
```

## 3️⃣ Interface do Serviço - IAuthService.cs

```csharp
using TaskManager.Models;

namespace TaskManager.Services
{
	public interface IAuthService
	{
		Task<AuthResponse> LoginAsync(LoginRequest request);
		Task<AuthResponse> RegisterAsync(RegisterRequest request);
		Task<User?> GetUserByIdAsync(int userId);
		string GenerateJwtToken(User user);
	}
}
```

## 4️⃣ Serviço de Autenticação - AuthService.cs

```csharp
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TaskManager.Models;
using BCrypt.Net;

namespace TaskManager.Services
{
	public class AuthService : IAuthService
	{
		private readonly ApplicationDbContext _context;
		private readonly IConfiguration _configuration;

		public AuthService(ApplicationDbContext context, IConfiguration configuration)
		{
			_context = context;
			_configuration = configuration;
		}

		public async Task<AuthResponse> LoginAsync(LoginRequest request)
		{
			var user = await _context.Users
				.FirstOrDefaultAsync(u => u.Email == request.Email);

			if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
			{
				throw new UnauthorizedAccessException("Email ou senha inválidos");
			}

			var token = GenerateJwtToken(user);

			return new AuthResponse
			{
				Token = token,
				User = new UserDto
				{
					Id = user.Id,
					Name = user.Name,
					Email = user.Email
				}
			};
		}

		public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
		{
			// Verifica se email já existe
			if (await _context.Users.AnyAsync(u => u.Email == request.Email))
			{
				throw new InvalidOperationException("Email já cadastrado");
			}

			// Cria novo usuário
			var user = new User
			{
				Name = request.Name,
				Email = request.Email,
				PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
				CreatedAt = DateTime.UtcNow,
				UpdatedAt = DateTime.UtcNow
			};

			_context.Users.Add(user);
			await _context.SaveChangesAsync();

			var token = GenerateJwtToken(user);

			return new AuthResponse
			{
				Token = token,
				User = new UserDto
				{
					Id = user.Id,
					Name = user.Name,
					Email = user.Email
				}
			};
		}

		public async Task<User?> GetUserByIdAsync(int userId)
		{
			return await _context.Users.FindAsync(userId);
		}

		public string GenerateJwtToken(User user)
		{
			var jwtKey = _configuration["Jwt:Key"] 
				?? throw new InvalidOperationException("JWT Key não configurada");
			var jwtIssuer = _configuration["Jwt:Issuer"] ?? "TaskManagerAPI";
			var jwtAudience = _configuration["Jwt:Audience"] ?? "TaskManagerClient";

			var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
			var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

			var claims = new[]
			{
				new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
				new Claim(JwtRegisteredClaimNames.Email, user.Email),
				new Claim(JwtRegisteredClaimNames.Name, user.Name),
				new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
			};

			var token = new JwtSecurityToken(
				issuer: jwtIssuer,
				audience: jwtAudience,
				claims: claims,
				expires: DateTime.UtcNow.AddDays(7),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
```

## 5️⃣ Controller - AuthController.cs

```csharp
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManager.Models;
using TaskManager.Services;

namespace TaskManager.Controllers
{
	[ApiController]
	[Route("api/auth")]
	public class AuthController : ControllerBase
	{
		private readonly IAuthService _authService;

		public AuthController(IAuthService authService)
		{
			_authService = authService;
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginRequest request)
		{
			try
			{
				var response = await _authService.LoginAsync(request);
				return Ok(response);
			}
			catch (UnauthorizedAccessException ex)
			{
				return Unauthorized(new { message = ex.Message });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Erro ao fazer login", error = ex.Message });
			}
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] RegisterRequest request)
		{
			try
			{
				var response = await _authService.RegisterAsync(request);
				return Ok(response);
			}
			catch (InvalidOperationException ex)
			{
				return BadRequest(new { message = ex.Message });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Erro ao cadastrar", error = ex.Message });
			}
		}

		[Authorize]
		[HttpGet("me")]
		public async Task<IActionResult> GetCurrentUser()
		{
			try
			{
				var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
				{
					return Unauthorized(new { message = "Token inválido" });
				}

				var user = await _authService.GetUserByIdAsync(userId);
				if (user == null)
				{
					return NotFound(new { message = "Usuário não encontrado" });
				}

				return Ok(new UserDto
				{
					Id = user.Id,
					Name = user.Name,
					Email = user.Email
				});
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { message = "Erro ao buscar usuário", error = ex.Message });
			}
		}
	}
}
```

## 6️⃣ Atualizar TasksController.cs

Adicione filtro por usuário no controller de tasks:

```csharp
// No início do controller, adicione:
private int GetCurrentUserId()
{
	var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
	if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
	{
		throw new UnauthorizedAccessException("Usuário não autenticado");
	}
	return userId;
}

// No método GET para listar tasks:
[Authorize]
[HttpGet]
public async Task<IActionResult> GetTasks()
{
	try
	{
		var userId = GetCurrentUserId();
		var tasks = await _context.Tasks
			.Where(t => t.UserId == userId) // Filtra por usuário
			.OrderBy(t => t.Order)
			.ToListAsync();
		return Ok(tasks);
	}
	catch (Exception ex)
	{
		return StatusCode(500, new { message = ex.Message });
	}
}

// No método POST para criar task:
[Authorize]
[HttpPost]
public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
{
	try
	{
		var userId = GetCurrentUserId();
		task.UserId = userId; // Associa ao usuário atual
		task.CreatedAt = DateTime.UtcNow;

		_context.Tasks.Add(task);
		await _context.SaveChangesAsync();

		return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
	}
	catch (Exception ex)
	{
		return StatusCode(500, new { message = ex.Message });
	}
}

// Adicione verificação de propriedade em UPDATE e DELETE:
[Authorize]
[HttpPut("{id}")]
public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskItem updatedTask)
{
	try
	{
		var userId = GetCurrentUserId();
		var task = await _context.Tasks.FindAsync(id);

		if (task == null) return NotFound();
		if (task.UserId != userId) return Forbid(); // Verifica se é do usuário

		// ... resto do código
	}
	catch (Exception ex)
	{
		return StatusCode(500, new { message = ex.Message });
	}
}
```

## 7️⃣ Atualizar ApplicationDbContext.cs

```csharp
public class ApplicationDbContext : DbContext
{
	public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
		: base(options)
	{
	}

	public DbSet<TaskItem> Tasks { get; set; }
	public DbSet<User> Users { get; set; } // ADICIONAR

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		// Configuração de User
		modelBuilder.Entity<User>(entity =>
		{
			entity.HasKey(e => e.Id);
			entity.HasIndex(e => e.Email).IsUnique();
			entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
			entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
			entity.Property(e => e.PasswordHash).IsRequired();
		});

		// Configuração de TaskItem
		modelBuilder.Entity<TaskItem>(entity =>
		{
			entity.HasKey(e => e.Id);

			// Relacionamento com User
			entity.HasOne<User>()
				.WithMany(u => u.Tasks)
				.HasForeignKey(t => t.UserId)
				.OnDelete(DeleteBehavior.Cascade);
		});
	}
}
```

## 8️⃣ Atualizar TaskItem.cs (Model)

```csharp
public class TaskItem
{
	public int Id { get; set; }
	public string Title { get; set; } = string.Empty;
	public bool IsCompleted { get; set; }
	public int Category { get; set; }
	public int Priority { get; set; }
	public int Order { get; set; }
	public DateTime CreatedAt { get; set; }
	public int UserId { get; set; } // ADICIONAR
}
```

## 9️⃣ Configurar JWT no Program.cs

```csharp
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using TaskManager.Services; // Adicionar

var builder = WebApplication.CreateBuilder(args);

// Adicionar serviços
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Auth Service - ADICIONAR
builder.Services.AddScoped<IAuthService, AuthService>();

// JWT Authentication - ADICIONAR
var jwtKey = builder.Configuration["Jwt:Key"] 
	?? throw new InvalidOperationException("JWT Key não configurada");

builder.Services.AddAuthentication(options =>
{
	options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
	options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
	options.TokenValidationParameters = new TokenValidationParameters
	{
		ValidateIssuer = true,
		ValidateAudience = true,
		ValidateLifetime = true,
		ValidateIssuerSigningKey = true,
		ValidIssuer = builder.Configuration["Jwt:Issuer"],
		ValidAudience = builder.Configuration["Jwt:Audience"],
		IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
	};
});

// CORS
builder.Services.AddCors(options =>
{
	options.AddPolicy("AllowFrontend", policy =>
	{
		policy.WithOrigins("http://localhost:5173") // Vite default port
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication(); // ADICIONAR - antes de UseAuthorization
app.UseAuthorization();
app.MapControllers();

app.Run();
```

## 🔟 Atualizar appsettings.json

```json
{
  "ConnectionStrings": {
	"DefaultConnection": "Server=localhost;Database=TaskManagerDB;Trusted_Connection=true;TrustServerCertificate=true;"
  },
  "Jwt": {
	"Key": "SuaChaveSecretaMuitoSeguraComPeloMenos32Caracteres!",
	"Issuer": "TaskManagerAPI",
	"Audience": "TaskManagerClient"
  },
  "Logging": {
	"LogLevel": {
	  "Default": "Information",
	  "Microsoft.AspNetCore": "Warning"
	}
  },
  "AllowedHosts": "*"
}
```

## ✅ Checklist de Implementação

- [ ] Execute o script SQL `database-migration-auth.sql`
- [ ] Instale os pacotes NuGet (JWT e BCrypt)
- [ ] Crie os modelos (User, LoginRequest, RegisterRequest, AuthResponse)
- [ ] Crie a interface e serviço de autenticação
- [ ] Crie o AuthController
- [ ] Atualize o ApplicationDbContext
- [ ] Atualize o TaskItem model (adicione UserId)
- [ ] Atualize o TasksController (adicione filtros por usuário)
- [ ] Configure JWT no Program.cs
- [ ] Atualize appsettings.json com as chaves JWT
- [ ] Teste os endpoints de login e register
- [ ] Teste os endpoints de tasks com autenticação

## 🧪 Testando a API

### Registro
```bash
POST http://localhost:5340/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456"
}
```

### Login
```bash
POST http://localhost:5340/api/auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "123456"
}
```

### Buscar usuário atual
```bash
GET http://localhost:5340/api/auth/me
Authorization: Bearer {seu-token-aqui}
```

### Listar tasks do usuário
```bash
GET http://localhost:5340/api/tasks
Authorization: Bearer {seu-token-aqui}
```

## 🎉 Pronto!

Agora seu sistema tem autenticação completa! Cada usuário verá apenas suas próprias tarefas.

## 🔒 Dicas de Segurança

1. **NUNCA** commite a chave JWT no Git
2. Use variáveis de ambiente em produção
3. Troque a chave JWT regularmente
4. Implemente rate limiting para prevenir brute force
5. Adicione validação de email (confirmação por email)
6. Implemente recuperação de senha
7. Use HTTPS em produção
