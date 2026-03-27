using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Extensions
{
    public static class MappingExtensions
    {
        public static IServiceCollection AddMapping(this IServiceCollection services)
        {
            services.AddAutoMapper(_ => { }, Assembly.GetExecutingAssembly());
            return services;
        }
    }
}