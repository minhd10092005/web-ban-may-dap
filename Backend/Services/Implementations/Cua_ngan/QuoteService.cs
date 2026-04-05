using Backend.Data;
using Backend.DTOs.Quote;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Services.Implementations
{
    public class QuoteService_cuangan : IQuoteService_cuangan
    {
        private readonly AppDbContext _context;

        public QuoteService_cuangan(AppDbContext context)
        {
            _context = context;
        }

        // 1. HÀM TẠO MỚI PHẢN HỒI
        public async Task<QuoteDto> CreateQuoteAsync(QuoteCreateDto dto)
        {
            string combinedComments = $"[{dto.Rating}/5 SAO] - {dto.Comments}";

            var quote = new Quote(
                dto.FullName,
                dto.CompanyName,
                dto.Address,
                dto.City,
                dto.State,
                dto.PostalCode,
                dto.Country,
                dto.EmailAddress,
                dto.Phone,
                combinedComments
            );

            quote.CreatedAt = DateTime.UtcNow;

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return new QuoteDto
            {
                Id = quote.Id,
                FullName = quote.FullName,
                Comments = quote.Comments,
                Rating = dto.Rating, // Trả về luôn số sao từ DTO gửi lên
                CreatedAt = quote.CreatedAt
            };
        }

        // 2. HÀM LẤY DANH SÁCH VÀ TÁCH SỐ SAO (LOGIC CÁCH 1)
        public async Task<IEnumerable<QuoteDto>> GetAllQuotesAsync()
        {
            // Lấy dữ liệu từ DB
            var quotes = await _context.Quotes
                .OrderByDescending(q => q.CreatedAt)
                .ToListAsync();

            // Duyệt danh sách để tách số sao từ chuỗi [X/5 SAO]
            var result = quotes.Select(quote => {
                int extractedRating = 5; // Mặc định 5 nếu ko tìm thấy

                try
                {
                    if (!string.IsNullOrEmpty(quote.Comments) && quote.Comments.StartsWith("["))
                    {
                        // Tách tại dấu '/' để lấy phần đầu "[5"
                        var parts = quote.Comments.Split('/');
                        if (parts.Length > 0)
                        {
                            string starPart = parts[0].Replace("[", "").Trim();
                            int.TryParse(starPart, out extractedRating);
                        }
                    }
                }
                catch { extractedRating = 5; }

                return new QuoteDto
                {
                    Id = quote.Id,
                    FullName = quote.FullName,
                    CompanyName = quote.CompanyName,
                    EmailAddress = quote.EmailAddress,
                    Comments = quote.Comments,
                    Rating = extractedRating, // Đưa con số đã tách vào đây
                    CreatedAt = quote.CreatedAt
                };
            });

            return result;
        }
    } // Đóng Class
} // Đóng Namespace