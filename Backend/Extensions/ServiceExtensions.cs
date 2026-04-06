using Backend.Services.Implementations;
using Backend.Services.Interfaces;

namespace Backend.Extensions
{
   public static class ServiceExtensions
   {
       public static IServiceCollection AddApplicationServices(this IServiceCollection services)
       {
           services.AddScoped<IProductService, ProductService>();
           services.AddScoped<ICateService, CateService>();
           services.AddScoped<IProductDetailService, ProductDetailService>();
           services.AddScoped<IProductImageService, ProductImageService>();
           services.AddScoped<IAdminService, AdminService>();
           services.AddScoped<IUserService, UserService>();
           services.AddScoped<IQuoteService, QuoteService>();
           services.AddScoped<ICandidateProfileService, CandidateProfileService>();

           return services;
       }
   }
}

