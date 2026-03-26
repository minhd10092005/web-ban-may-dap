using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Backend.Models.admin;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductDetail> ProductDetails { get; set; }
        public DbSet<Quote> Quotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình User: Email là duy nhất
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Email).IsUnique();
                entity.Property(u => u.Email).HasMaxLength(150).IsRequired();
            });

            // Cấu hình Admin: Email là duy nhất
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasIndex(a => a.Email).IsUnique();
                entity.Property(a => a.Email).HasMaxLength(150).IsRequired();
            });

            // Quan hệ 1-1 giữa User và CandidateProfile
            modelBuilder.Entity<CandidateProfile>()
                .HasOne(cp => cp.User)
                .WithOne()
                .HasForeignKey<CandidateProfile>(cp => cp.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.Property(c => c.CateName).HasMaxLength(100).IsRequired();
            });

            // Cấu hình ProductDetail (QUAN TRỌNG NHẤT)
            modelBuilder.Entity<ProductDetail>(entity =>
            {
                // 1. Xác định ProductId vừa là Khóa ngoại vừa là Khóa chính
                entity.HasKey(pd => pd.ProductId);

                // 2. Cấu hình Quan hệ 1-1 với Product (Xóa sạch bóng ma ProductId1)
                entity.HasOne(pd => pd.Product)
                    .WithOne(p =>
                        p.ProductDetail) // Đảm bảo Class Product dùng thuộc tính: public ProductDetail? ProductDetail {get;set;}
                    .HasForeignKey<ProductDetail>(pd => pd.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);

                // 3. Quan hệ 1-Nhiều với Category (Một Category có nhiều ProductDetail)
                entity.HasOne(pd => pd.Category)
                    .WithMany(c =>
                        c.ProductDetails) // Đảm bảo Class Category có: public ICollection<ProductDetail> ProductDetails {get;set;}
                    .HasForeignKey(pd => pd.CateId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);
            });

            // Lọc dữ liệu "Xóa ảo" (Soft Delete) - Khi lấy dữ liệu sẽ tự bỏ qua các dòng IsDeleted = true
            modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
            modelBuilder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
        }

        // Tự động cập nhật ngày giờ Audit
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is EntityClass &&
                            (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                var entity = (EntityClass)entityEntry.Entity;
                var now = DateTime.UtcNow; // Dùng UtcNow để đồng bộ múi giờ quốc tế

                if (entityEntry.State == EntityState.Added)
                {
                    entity.CreatedAt = now;
                    entity.IsDeleted = false;
                }

                entity.UpdatedAt = now;
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}