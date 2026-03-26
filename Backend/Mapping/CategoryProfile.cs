using AutoMapper;
using Backend.DTOs.Category;
using Backend.Models;

namespace Backend.Mapping
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            //Entity → DTO (chi tiết)
            CreateMap<Category, CateDto>();


            //Create DTO → Entity
            CreateMap<CateCreateDto, Category>();

        }
    }
}
