using AutoMapper;
using Backend.DTOs.ProductDetail;
using Backend.Models;

namespace Backend.Mapping
{
    public class ProductDetailProfile : Profile
    {
        public ProductDetailProfile()
        {
            CreateMap<ProductDetail, ProductDetailDto>()
                .ForMember(dest => dest.ProductName,
                    opt => opt.MapFrom(src => src.Product != null ? src.Product.ProductName : "Máy không tên"))
                .ForMember(dest => dest.CateName,
                    opt => opt.MapFrom(src => src.Category != null ? src.Category.CateName : "Chưa phân loại"));

            CreateMap<PrdDetailCreateDto, ProductDetail>();

            CreateMap<PrdDetailUpdateDto, ProductDetail>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}
