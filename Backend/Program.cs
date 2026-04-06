using Backend.Data;
using Backend.Extensions;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services; // Namespace thực tế của file ProductService_cuaminh
using Backend.Services.Interfaces;
using Backend.Services.Implementations;
using Backend.Services.Implementations.Cua_ngan;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. SERVICES & DATABASE CONFIGURATION
// ==========================================================

builder.Services.AddControllers();

// Cấu hình Database (MySQL)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString!)
           .LogTo(Console.WriteLine, LogLevel.Information)
);

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMemoryCache();
builder.Services.AddMapping();
builder.Services.AddCustomAuthorization();

// ==========================================================
// 2. DEPENDENCY INJECTION (BẢN FIX THEO NAMESPACE PHẲNG)
// ==========================================================

// --- Nhóm Sản phẩm ---
// Vì file của bro khai báo namespace Backend.Services nên gọi trực tiếp như này:
builder.Services.AddScoped<IProductService, ProductService_cuaminh>();
builder.Services.AddScoped<IProductService_cuaminh, ProductService_cuaminh>();
builder.Services.AddScoped<IProductRepository_cuaminh, ProductRepository_cuaminh>();

// --- Nhóm Category & Details (Các file này nằm trong namespace Implementations) ---
builder.Services.AddScoped<ICateService, CateService>();
builder.Services.AddScoped<IProductDetailService, ProductDetailService>();
builder.Services.AddScoped<IProductImageService, ProductImageService>();

// --- Nhóm Admin & User ---
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<ICandidateProfileService, CandidateProfileService>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();

// --- Tiện ích ---
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IQuoteService, QuoteService>();
builder.Services.AddScoped<IQuoteService_cuangan, QuoteService_cuangan>();

// ==========================================================
// 3. JWT AUTHENTICATION LOGIC
// ==========================================================

var jwtKey = builder.Configuration["Jwt:Key"] ?? "Chuoi_Key_Du_Phong_Cho_Duan_May_Dap_123456";
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
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "Backend",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "Frontend",
        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// ==========================================================
// 4. MIDDLEWARE PIPELINE
// ==========================================================

app.UseCustomMiddleware();
app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();