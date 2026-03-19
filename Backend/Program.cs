using Backend.Data;
using Backend.Repositories;
using Backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// --- 1. CẤU HÌNH CORS (Gộp chung cả 2 link Frontend vào đây cho gọn) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Cho phép cả localhost:3000 và localhost:5173 gọi API
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// --- 2. CẤU HÌNH ĐỌC TOKEN JWT ---
var jwtKey = builder.Configuration["Jwt:Key"]!;
var keyBytes = Encoding.ASCII.GetBytes(jwtKey);

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
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- 3. CẤU HÌNH SWAGGER (CÓ Ổ KHÓA) ---
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
            new string[] {}
        }
    });
});

// --- 4. CẤU HÌNH DATABASE & REPOSITORY ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.AddScoped<IProductRepository, ProductRepository>();

var app = builder.Build();

// --- 5. PIPELINE XỬ LÝ REQUEST CỦA ỨNG DỤNG ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// THỨ TỰ 3 DÒNG NÀY CỰC KỲ QUAN TRỌNG - KHÔNG ĐƯỢC ĐỔI CHỖ
app.UseCors("AllowFrontend"); // 1. Cho phép Frontend đi qua cổng
app.UseAuthentication();      // 2. Trạm kiểm tra vé (Token)
app.UseAuthorization();       // 3. Trạm cấp quyền vào xem dữ liệu

app.MapControllers();

app.Run();