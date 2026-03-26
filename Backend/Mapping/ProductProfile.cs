using AutoMapper;
using Backend.DTOs.Product;
using Backend.Models;

namespace Backend.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            // Entity → DTO
            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Category!=null?src.Category:null));
                
            

            // DTO → Entity (Create)
            CreateMap<ProductCreateDto, Product>();

            // DTO → Entity (Update)
            CreateMap<ProductUpdateDto, Product>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
