using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // modelBuilder.Entity<Quote>().ToTable("quotes");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }

        public DbSet<CandidateProfile> CandidateProfiles { get; set; }

    }
}
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductDetail> ProductDetails { get; set; }
        public DbSet<Quote> Quotes { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. Cấu hình bảng ProductImage (Khóa chặt 2 cột ma)
            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.ToTable("productimages");
                entity.HasKey(pi => pi.Id);

                // Chỉ map những cột CÓ THẬT trong Database thực tế của ông
                entity.Property(pi => pi.Id).HasColumnName("Id");
                entity.Property(pi => pi.ProductId).HasColumnName("ProductId");
                entity.Property(pi => pi.ImageUrl).HasColumnName("ImageUrl");
                entity.Property(pi => pi.CreatedAt).HasColumnName("CreatedAt");
                entity.Property(pi => pi.IsDeleted).HasColumnName("IsDeleted");

                // THẦN CHÚ DIỆT LỖI Ở ĐÂY:
                // Ép EF Core lờ đi 2 cột này vì DB thực tế của ông không có
                entity.Ignore(pi => pi.UpdatedAt);
                entity.Ignore(pi => pi.DeletedAt);

                entity.HasOne(pi => pi.Product)
                    .WithMany(p => p.ProductImages)
                    .HasForeignKey(pi => pi.ProductId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // 2. Cấu hình bảng Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("products");
                entity.HasKey(p => p.Id);

                entity.Property(p => p.Id).HasColumnName("Id");
                entity.Property(p => p.ProductName).HasColumnName("ProductName");
                entity.Property(p => p.ProductType).HasColumnName("ProductType");
                entity.Property(p => p.CreatedAt).HasColumnName("CreatedAt");
                entity.Property(p => p.UpdatedAt).HasColumnName("UpdatedAt");
                entity.Property(p => p.IsDeleted).HasColumnName("IsDeleted");
                entity.Property(p => p.DeletedAt).HasColumnName("DeletedAt");

                entity.HasQueryFilter(p => !p.IsDeleted);
            });

            // 3. Cấu hình bảng ProductDetail (Map kỹ để tránh lỗi Id hay ProductId)
            modelBuilder.Entity<ProductDetail>(entity =>
            {
                entity.ToTable("productdetails");

                // Khóa chính thực sự trong DB là ProductId
                entity.HasKey(pd => pd.ProductId);

                entity.Property(pd => pd.ProductId).HasColumnName("ProductId");

                // CHẶN ĐỨNG LỖI p0.Id Ở ĐÂY
                entity.Ignore(pd => pd.Id);

                entity.Property(pd => pd.CateId).HasColumnName("CateId");
                entity.Property(pd => pd.Description).HasColumnName("Description");
            });

            // 4. Cấu hình bảng Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.ToTable("categories");
                entity.HasKey(c => c.CateId);
                entity.Property(c => c.CateId).HasColumnName("CateId");
                entity.Property(c => c.CateName).HasColumnName("CateName");
                entity.Property(c => c.CreatedAt).HasColumnName("CreatedAt");
                entity.Property(c => c.UpdatedAt).HasColumnName("UpdatedAt");
                entity.Property(c => c.IsDeleted).HasColumnName("IsDeleted");
                entity.Property(c => c.DeletedAt).HasColumnName("DeletedAt");
            });
        }

        // Tự động gán thời gian khi lưu
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entityEntry in entries)
            {
                var entity = entityEntry.Entity;
                var now = DateTime.Now;

                if (entityEntry.State == EntityState.Added)
                {
                    TrySetProperty(entity, "CreatedAt", now);
                    TrySetProperty(entity, "IsDeleted", false);
                }
                TrySetProperty(entity, "UpdatedAt", now);
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        private void TrySetProperty(object entity, string propertyName, object value)
        {
            var prop = entity.GetType().GetProperty(propertyName);
            if (prop != null && prop.CanWrite)
            {
                prop.SetValue(entity, value);
            }
        }
    }
}