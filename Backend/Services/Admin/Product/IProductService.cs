using Backend.DTOs.Product;

namespace Backend.Services.Admin.Product
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync();
        Task<ProductDto?> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(ProductCreateDto dto);
        Task<bool> UpdateAsync(int id, ProductUpdateDto dto);
        Task<bool> DeleteAsync(int id);

    }
// The IProductService interface defines methods for CRUD operations on products.
// Each method is asynchronous to support non-blocking database access.

/*
    Task<List<ProductDto>> GetAllAsync();
    // Retrieves a list of all products.

    Task<ProductDto?> GetByIdAsync(int id);
    // Retrieves a single product by its unique identifier. Returns null if not found.

    Task<ProductDto> CreateAsync(ProductCreateDto dto);
    // Creates a new product using details provided in the ProductCreateDto object, and returns the created product as a ProductDto.

    Task<bool> UpdateAsync(int id, ProductCreateDto dto);
    // Updates an existing product identified by id with the values from the ProductCreateDto. Returns true if update succeeded.

    Task<bool> DeleteAsync(int id);
    // Deletes the product specified by id. Returns true if delete succeeded.
*/
    

}