using Backend.Data;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. CẤU HÌNH CONTROLLERS & API EXPLORER
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddMemoryCache(); // 👈 THÊM DÒNG NÀY ĐỂ TÍNH NĂNG GỬI OTP KHÔNG BỊ LỖI 500

// 2. CẤU HÌNH CORS (Cho phép React/Vite gọi API)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 3. CẤU HÌNH DATABASE (MySQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// 4. CẤU HÌNH REPOSITORIES
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IQuoteRepository, QuoteRepository>();
builder.Services.AddScoped<ICandidateRepository, CandidateRepository>();
builder.Services.AddScoped<Backend.Services.IEmailService, Backend.Services.EmailService>();

// 5. CẤU HÌNH ĐỌC TOKEN JWT
var jwtKey = builder.Configuration["Jwt:Key"]!;
var keyBytes = Encoding.UTF8.GetBytes(jwtKey); // 👈 ĐÃ ĐỔI TỪ ASCII SANG UTF8 CHUẨN BÀI!

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
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// 6. CẤU HÌNH SWAGGER (CÓ Ổ KHÓA BẢO MẬT)
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập Token theo cú pháp: Bearer {chuỗi_token_của_bạn}",
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

// ============================================================
// BUILD THÀNH APP VÀ CẤU HÌNH PIPELINE (MIDDLEWARES)
// ============================================================
var app = builder.Build();

// Chỉ hiện Swagger khi ở chế độ lập trình (Dev)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// THỨ TỰ 3 DÒNG NÀY CỰC KỲ QUAN TRỌNG - KHÔNG ĐƯỢC ĐỔI CHỖ
app.UseCors("AllowFrontend");   // 1. Mở cửa cho Frontend vào
app.UseAuthentication();        // 2. Trạm soát vé (Kiểm tra Token)
app.UseAuthorization();         // 3. Trạm cấp quyền (Quyết định được xem dữ liệu gì)

app.MapControllers();

app.Run();