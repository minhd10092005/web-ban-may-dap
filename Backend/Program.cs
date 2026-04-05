using Backend.Data;
using Backend.Extensions;
using Backend.Services.Implementations.Cua_ngan;
using Backend.Services.Interfaces.Ngan;
using Backend.Data;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
// ==========================================================
// SERVICES
// ==========================================================
// Controllers
builder.Services.AddControllers();
// DB
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// DB - ĐÃ SỬA THÀNH MYSQL Ở ĐÂY NHÉ!
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))
//);

// DB - ĐÃ SỬA THÀNH MYSQL VÀ FIX LỖI AUTODETECT
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseMySql(
//        connectionString,
//        new MySqlServerVersion(new Version(8, 0, 0)) // Chốt cứng version luôn, cấm nó AutoDetect nữa!
//    )
//);

// DB - DÙNG MYSQL CHÍNH CHỦ CHO .NET 10
// DB - DÙNG MYSQL CHÍNH CHỦ VÀ BẬT LOG ĐỂ KIỂM TRA LỖI
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString)
           .LogTo(Console.WriteLine, LogLevel.Information) // THÊM DÒNG NÀY VÀO ĐÂY!
);

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMemoryCache();

// 2. CORS (CHO PHÉP FRONTEND)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Swagger
builder.Services.AddSwaggerDocumentation();

// Extensions 
//builder.Services.AddApplicationServices();
builder.Services.AddMapping();
builder.Services.AddJwtAuth(builder.Configuration);
builder.Services.AddCustomAuthorization();

// Đăng ký DI cho QuoteService
// Viết rõ ràng từng Namespace để máy không cãi được
builder.Services.AddScoped<Backend.Services.Interfaces.IQuoteService_cuangan, Backend.Services.Implementations.QuoteService_cuangan>();

builder.Services.AddScoped<Backend.Repositories.IProductRepository_cuaminh, Backend.Repositories.ProductRepository_cuaminh>();
builder.Services.AddScoped<Backend.Services.IProductService_cuaminh, Backend.Services.ProductService_cuaminh>();

// 3. DATABASE (MYSQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection")!)
);

// 4. REPOSITORY
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
// Mở lại dòng này nếu bạn đã có file EmailService, nếu chưa có thì tạm comment lại (//) nhé
// builder.Services.AddScoped<Backend.Services.IEmailService, Backend.Services.EmailService>();

// 5. JWT AUTHENTICATION (ÔNG BẢO VỆ XÓT VÉ)
var jwtKey = builder.Configuration["Jwt:Key"]!;
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
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

// 6. SWAGGER
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập Token: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();
// ==========================================================
// MIDDLEWARE PIPELINE
// ==========================================================
// Swagger (dev)
app.UseSwagger();
app.UseSwaggerUI();

//  Custom middleware (Exception, Logging, Performance...)
app.UseCustomMiddleware();

// HTTPS
app.UseHttpsRedirection();

// --- BẮT ĐẦU ĐOẠN QUAN TRỌNG ĐỂ FIX 404 ---
app.UseRouting(); // Thêm dòng này để định tuyến

// CORS: Phải nằm sau UseRouting
app.UseCors("AllowReact");

// Auth
app.UseAuthentication();
app.UseAuthorization();

// Routing: Ánh xạ các controller
app.MapControllers();
// --- KẾT THÚC ĐOẠN FIX ---

app.Run();