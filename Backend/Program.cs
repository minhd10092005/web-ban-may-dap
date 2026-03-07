using Microsoft.EntityFrameworkCore;
// using Backend.Data; // Tháo comment khi đã tạo file Data/AppDbContext.cs

var builder = WebApplication.CreateBuilder(args);

// --- 1. Cấu hình Controller ---
builder.Services.AddControllers();

// --- 2. Cấu hình CORS (Mở cửa cho React) ---
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:5173") // Cổng mặc định của Vite
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// --- 3. Cấu hình Database (Entity Framework) ---
// Tháo comment 3 dòng dưới khi đã tạo file AppDbContext.cs
/*
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
*/

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// --- 4. Kích hoạt CORS ---
app.UseCors("AllowReact");

app.UseAuthorization();

// --- 5. Tự động tìm các API trong thư mục Controllers ---
app.MapControllers();

app.Run();