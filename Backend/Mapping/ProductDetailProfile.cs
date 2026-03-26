using AutoMapper;
using Backend.DTOs.ProductDetail;
using Backend.Models;

namespace Backend.Mapping
{
    public class ProductDetailProfile : Profile
    {
        public ProductDetailProfile()
        {
            // Entity → DTO
            CreateMap<ProductDetail, ProductDetailDto>()
                .ForMember(dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Product!.ProductName))
                .ForMember(dest => dest.CateName,
                    opt => opt.MapFrom(src => src.Category!.CateName));

            // DTO → Entity (Create)
            CreateMap<PrdDetailCreateDto, ProductDetail>();

            // DTO → Entity (Update)
            CreateMap<PrdDetailUpdateDto, ProductDetail>();
        }
    }
}
