using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        // =========================================================================
        // Logic: Lấy danh sách sản phẩm có Tìm kiếm, Lọc Danh mục và Phân trang
        // =========================================================================
        public async Task<object> GetProductsAdvanced(string search, int? categoryId, int page, int pageSize)
        {
            // Kết hợp bảng products và product_details để lấy CategoryId
            var query = from p in _context.Products
                        join pd in _context.ProductDetails on p.ProductId equals pd.ProductId into pdJoin
                        from pd in pdJoin.DefaultIfEmpty()
                        select new { Product = p, CategoryId = pd != null ? pd.CategoryId : 0 };

            // 1. Lọc theo từ khóa tìm kiếm
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x => x.Product.ProductName.Contains(search));
            }

            // 2. Lọc theo danh mục
            if (categoryId.HasValue && categoryId.Value > 0)
            {
                query = query.Where(x => x.CategoryId == categoryId.Value);
            }

            // Đếm tổng số lượng để chia trang
            int totalItems = await query.CountAsync();

            // Tính tổng số trang (Ví dụ: 8 sản phẩm / 6 = 1.33 => làm tròn lên 2 trang)
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            // 3. Phân trang (Cắt dữ liệu bằng Skip & Take)
            var pagedData = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(x => new ProductListDTO
                {
<<<<<<< HEAD
                    Id = x.Product.ProductId,
                    Name = x.Product.ProductName,
                    ModelNumber = "N/A", // Giữ nguyên để React không lỗi giao diện cũ
                    ImageUrl = x.Product.ImageUrl ?? "https://placehold.co/250x220?text=No+Image"
=======
                    Id = p.Id,
                    Name = p.Name,
                    ImageUrl = p.ImageUrl // Đã đổi từ ModelNumber sang ImageUrl
>>>>>>> 63e53f2d11e14889da4629cc6978c27bb7be35a8
                })
                .ToListAsync();

            // Trả về một object bọc cả Data lẫn thông tin phân trang cho React xử lý
            return new
            {
                Products = pagedData,
                TotalPages = totalPages,
                CurrentPage = page
            };
        }

        // =========================================================================
        // Logic: Retrieves detailed information of a specific product with JOINs.
        // =========================================================================
        public async Task<ProductDetailDTO> GetProductById(int id)
        {
<<<<<<< HEAD
            // Thực hiện JOIN 3 bảng: products, product_details, category
            var query = from p in _context.Products
                        join pd in _context.ProductDetails on p.ProductId equals pd.ProductId into pdJoin
                        from pd in pdJoin.DefaultIfEmpty() // LEFT JOIN
                        where p.ProductId == id
                        select new { p, pd };
=======
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Select(p => new ProductDetailDTO
                {
                    Name = p.Name,
                    ImageUrl = p.ImageUrl, // Đã đổi từ ModelNumber sang ImageUrl

                    // Đoạn code xử lý Specs của bạn viết rất chuẩn, tôi giữ nguyên:
                    Specs = _context.ProductSpecs
                        .Where(s => s.ProductId == p.Id)
                        .Select(s => new ProductSpecDTO
                        {
                            SpecName = s.SpecName,
                            SpecValue = s.SpecValue,
                            Unit = s.Unit
                        }).ToList()
                })
                .FirstOrDefaultAsync();
>>>>>>> 63e53f2d11e14889da4629cc6978c27bb7be35a8

            var result = await query.FirstOrDefaultAsync();

            if (result == null) return null;

            var detailDto = new ProductDetailDTO
            {
                Name = result.p.ProductName,
                ModelNumber = "N/A",
                ImageUrl = result.p.ImageUrl ?? "https://placehold.co/500x500?text=No+Image",
                Overview = result.p.Overview ?? "Đang cập nhật thông tin tổng quan...", // Lấy bài viết tổng quan
                Specs = new List<ProductSpecDTO>()
            };

            // Parse cột 'description' thành list Specs (Ví dụ: Output: 2000 c/hr | Size: 2mm)
            if (result.pd != null && !string.IsNullOrEmpty(result.pd.Description))
            {
                var specItems = result.pd.Description.Split('|', StringSplitOptions.RemoveEmptyEntries);
                foreach (var item in specItems)
                {
                    var parts = item.Split(':', 2); // Tách tại dấu ':' đầu tiên
                    if (parts.Length == 2)
                    {
                        detailDto.Specs.Add(new ProductSpecDTO
                        {
                            SpecName = parts[0].Trim(),
                            SpecValue = parts[1].Trim(),
                            Unit = "" // Đã bao gồm trong SpecValue
                        });
                    }
                }
            }

            // Lấy danh sách bộ sưu tập ảnh phụ từ bảng product_images
            var galleryImages = await _context.ProductImages
                .Where(img => img.ProductId == id)
                .Select(img => img.ImageUrl)
                .ToListAsync();

            // Nếu DB có ảnh phụ thì gán vào, nếu không có thì lấy tạm ảnh chính
            detailDto.Gallery = galleryImages.Count > 0
                ? galleryImages
                : new List<string> { detailDto.ImageUrl };

            return detailDto;
        }
    }
}