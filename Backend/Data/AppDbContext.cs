using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
<<<<<<< HEAD
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductDetail> ProductDetails { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
=======
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Quote> Quotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Quote>().ToTable("quotes");
        }
>>>>>>> 01b581039d261a092ea10797170a4308931fac48
    }
}