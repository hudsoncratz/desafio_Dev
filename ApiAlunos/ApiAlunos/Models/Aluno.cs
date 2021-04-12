using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiAlunos.Models
{
    public class Aluno
    {
        public int AlunoId { get; set; }
        [Required]
        [MaxLength(100)]        
        public string Nome { get; set; }
        
        [MaxLength(150)]
        public string  Email { get; set; }

    }
}
