using Backend.Mapping;

namespace Backend.Extensions
{
    public static class MappingExtensions
    {
        public static IServiceCollection AddMapping(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(ProductProfile));
            return services;
        }
    }
}