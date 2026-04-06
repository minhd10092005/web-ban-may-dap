using Backend.Data;
using Backend.Extensions;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services;
using Backend.Services.Implementations.Cua_ngan;
using Backend.Services.Interfaces.Ngan;
using Backend.Services.Interfaces.minh;
using Backend.Services.Implementations.Implementations_cuaminh;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Services.Implementations;
using Backend.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// SERVICES
// ==========================================================

// Controllers
builder.Services.AddControllers();

// DB (MYSQL - chỉ giữ 1 chỗ duy nhất)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString!)
           .LogTo(Console.WriteLine, LogLevel.Information)
);

// CORS (gộp lại 1 policy duy nhất)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000","http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Cache + Swagger base
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMemoryCache();

// Extensions (giữ lại nếu bạn đã custom)
builder.Services.AddSwaggerDocumentation();
builder.Services.AddMapping();
builder.Services.AddCustomAuthorization();


// ==========================================================
// DEPENDENCY INJECTION
// ==========================================================

// Services
builder.Services.AddScoped<IQuoteService_cuangan, QuoteService_cuangan>();
builder.Services.AddScoped<IProductService_cuaminh, ProductService_cuaminh>();

// Repositories
builder.Services.AddScoped<IProductRepository_cuaminh, ProductRepository_cuaminh>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICateService, CateService>();
builder.Services.AddScoped<IProductDetailService, ProductDetailService>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IQuoteService, QuoteService>();
builder.Services.AddScoped<ICandidateProfileService, CandidateProfileService>();

// Other services
builder.Services.AddScoped<IEmailService, EmailService>();

// ==========================================================
// JWT AUTH
// ==========================================================

var jwtKey = builder.Configuration["Jwt:Key"]!;
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),

        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],

        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],

        ClockSkew = TimeSpan.Zero
    };
});


// ==========================================================
// PIPELINE
// ==========================================================

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Custom middleware
// app.UseCustomMiddleware();

app.UseHttpsRedirection();

app.UseRouting();

// CORS
app.UseCors("AllowFrontend");

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Map API
app.MapControllers();

app.Run();