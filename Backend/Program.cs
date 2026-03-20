using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Repositories;
<<<<<<< HEAD
using Backend.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddScoped<IProductRepository, ProductRepository>();

var app = builder.Build();

app.UseHttpsRedirection();

=======

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// ✅ MYSQL (Oracle provider)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Repository
builder.Services.AddScoped<IQuoteRepository, QuoteRepository>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
>>>>>>> 01b581039d261a092ea10797170a4308931fac48
app.UseCors("AllowReact");
app.UseAuthorization();

app.MapControllers();

app.Run();