using System.ComponentModel.DataAnnotations;

namespace Backend.Models.admin
{

    public abstract class EntityClass
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } 
        public bool IsDeleted { get; set; } = false;
        public DateTime? DeletedAt { get; set; }
    }
}