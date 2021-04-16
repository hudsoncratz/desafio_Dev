import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';  
import { Observable } from 'rxjs';  
import { AlunoService } from '../aluno.service';  
import { Aluno } from '../aluno';  
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-aluno',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.css']
})

export class AlunoComponent implements OnInit {
  
  dataSaved = false;  
  alunoForm: any;  
  allAlunos!: Observable<Aluno[]>;
  nome: string = '';  
  filter: any;
  alunoIdUpdate = '';  
  message = '';  
  constructor(private formbulider: FormBuilder, private alunoService:AlunoService) { }
  ngOnInit() {
    this.alunoForm = this.formbulider.group({  
      Nome: ['', [Validators.required]],  
      Email: ['', [Validators.required]],
      SearchNome: '', 
    });  
    this.loadAllAlunos();  
  }
  Search() {
    if(this.nome == "") {
      this.ngOnInit();
    }
    else {
      this.allAlunos = this.allAlunos.pipe( map( array => array.filter(res => {
        return res.nome.toLocaleLowerCase().match(this.nome.toLocaleLowerCase())
      })
      ))
    }
  }
  loadAllAlunos() {  
    this.allAlunos = this.alunoService.getAllAlunos();  
  } 
  onFormSubmit() {  
    this.dataSaved = false;  
    const aluno = this.alunoForm.value;  
    this.CreateAluno(aluno);  
    this.alunoForm.reset();  
  } 
  CreateAluno(aluno: Aluno) {  
    if (this.alunoIdUpdate == '') {  
      this.alunoService.createAluno(aluno).subscribe(  
        () => {  
          this.dataSaved = true;  
          this.message = 'Registro salvo com sucesso';  
          this.loadAllAlunos();  
          this.alunoIdUpdate = '';
          alert(this.message);  
          this.alunoForm.reset();  
        }  
      );  
    } else {  
      aluno.alunoId = this.alunoIdUpdate;  
      this.alunoService.updateAluno(this.alunoIdUpdate,aluno).subscribe(() => {  
        this.dataSaved = true;  
        this.message = 'Registro atualizado com sucesso';  
        this.loadAllAlunos();  
        this.alunoIdUpdate = '';
        alert(this.message); 
        this.alunoForm.reset();  
      });  
    }  
  }  
  loadAlunoToEdit(alunoid: string) {  
    this.alunoService.getAlunoById(alunoid).subscribe(aluno=> {  
      this.message = '';  
      this.dataSaved = false;  
      this.alunoIdUpdate = aluno.alunoId;  
      this.alunoForm.controls['Nome'].setValue(aluno.nome);  
      this.alunoForm.controls['Email'].setValue(aluno.email);  
    });    
  }  
  deleteAluno(alunoid: string) {  
    if (confirm("Deseja realmente deletar este aluno ?")) {   
      this.alunoService.deleteAlunoById(alunoid).subscribe(() => {  
        this.dataSaved = true;  
        this.message = 'Registro deletado com sucesso';  
        this.loadAllAlunos();  
        this.alunoIdUpdate = '';  
        this.alunoForm.reset();  
      });  
    }  
  }  
  resetForm() {  
    this.alunoForm.reset();  
    this.message = '';  
    this.dataSaved = false;  
  } 
}