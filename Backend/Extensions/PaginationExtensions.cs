using Backend.DTOs.Common;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extensions
{
    public static class PaginationExtensions
    {
        public static async Task<PagedResult<T>> ToPagedListAsync<T>(
            this IQueryable<T> source,
            int pageNumber,
            int pageSize)
        {
            if (source == null) throw new ArgumentNullException(nameof(source));

            pageNumber = pageNumber < 1 ? 1 : pageNumber;
            const int maxPageSize = 50; 
            pageSize = (pageSize < 1) ? 10 : (pageSize > maxPageSize ? maxPageSize : pageSize);

            var count = await source.CountAsync();

            var items = await source
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<T>(items, count, pageNumber, pageSize);
        }
    }
}
