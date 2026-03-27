
using Microsoft.EntityFrameworkCore;

using Backend.Data;
using Backend.Extensions;


var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// SERVICES
// ==========================================================

// Controllers
builder.Services.AddControllers();

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Swagger
builder.Services.AddSwaggerDocumentation();

// 🔥 Extensions (cốt lõi hệ thống)
builder.Services.AddApplicationServices();
builder.Services.AddMapping();
builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddCustomAuthorization(); // nếu bạn đã có file này

var app = builder.Build();

// ==========================================================
// MIDDLEWARE PIPELINE
// ==========================================================

// Swagger (dev)
app.UseSwagger();
app.UseSwaggerUI();

// 🔥 Custom middleware (Exception, Logging, Performance...)
app.UseCustomMiddleware();

// HTTPS
app.UseHttpsRedirection();

// CORS
app.UseCors("AllowReact");

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Routing
app.MapControllers();

app.Run();