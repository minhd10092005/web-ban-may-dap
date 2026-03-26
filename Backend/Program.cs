using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Backend.Data;
using Backend.Services.Implementations;
using Backend.Services.Interfaces;
using Backend.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// (SERVICES - BUILDER)
// ==========================================================

builder.Services.AddControllers();

// 1. Gene Kết nối: Kết nối database 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Gene CORS: Mở cầu nối cho React
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICateService, CateService>();
builder.Services.AddScoped<IProductDetailService,ProductDetailService>();
// 3. Gene JWT: Thuê DI đọc mã vạch (Authentication)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "cc50fd77f8";
builder.Services.AddAuthentication(options => {
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options => {
    options.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = false, // Tạm thời tắt để Duy dễ test
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// 4. Gene Phân quyền: Quy định quyền vào khu vực cấm (Authorization)
builder.Services.AddAuthorization(options => {
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("CandidateOnly", policy => policy.RequireRole("Candidate"));
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ==========================================================
// MIDDLEWARE - PIPELINE)
// ==========================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(); 
}

app.UseMiddleware<ExceptionMiddleware>();

app.UseMiddleware<LoggingMiddleware>();

app.UseMiddleware<PerformanceMiddleware>();

app.UseMiddleware<RateLimitingMiddleware>();

app.UseMiddleware<SecurityHeadersMiddleware>();

// app.UseMiddleware<ResponseWrapperMiddleware>(); // optional

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();      // 4. Dẫn nước ra các đầu vòi (API Endpoints)

app.Run(); // Bấm nút khởi động nhà máy (Đã thêm dấu ngoặc tròn)