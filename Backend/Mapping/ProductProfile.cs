using AutoMapper;
using Backend.DTOs.Product;
using Backend.Models;

namespace Backend.Mapping
{
public class ProductProfile : Profile
{
    public ProductProfile()
    {
        // 1. Entity → DTO 
        CreateMap<Product, ProductDto>()
            .ForMember(dest => dest.ProductId, opt => opt.MapFrom(src => src.Id)) 
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.ProductName))
            .ForMember(dest => dest.CateName, opt => opt.MapFrom(src =>
                (src.ProductDetail != null && src.ProductDetail.Category != null)
                    ? src.ProductDetail.Category.CateName
                    : "Chưa phân loại"))
            .ForMember(dest => dest.CateId, opt => opt.MapFrom(src =>
                src.ProductDetail != null ? src.ProductDetail.CateId : 0));

        // 2. DTO → Entity 
        CreateMap<ProductCreateDto, Product>();

        // 3. DTO → Entity 
        CreateMap<ProductUpdateDto, Product>()
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
}
