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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
  
        base.OnModelCreating(modelBuilder);

  
        modelBuilder.Entity<User>(entity => {
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.Email).HasMaxLength(150).IsRequired();
        });


        modelBuilder.Entity<Admin>(entity => {
            entity.HasIndex(a => a.Email).IsUnique(); 
            entity.Property(a => a.Email).HasMaxLength(150).IsRequired();
        });

        modelBuilder.Entity<CandidateProfile>()
            .HasOne(cp => cp.User)
            .WithOne()
            .HasForeignKey<CandidateProfile>(cp => cp.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Category>(entity => {
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Product>()
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .OnDelete(DeleteBehavior.SetNull); 
    }
}

