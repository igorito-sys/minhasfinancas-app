import React from "react";
import { withRouter } from "react-router-dom";

import Card from '../components/card' 
import FormGroup from '../components/form-group' 

import UsuarioService from "../app/service/usuarioService";

import { msgErro, msgSucesso } from '../components/toastr'


class CadastroUsuario extends React.Component {

    state = {
        nome: '', 
        email: '',
        senha: '',
        senhaRepeticao: ''
    }

    constructor() {
        super();
        this.service = new UsuarioService();
    }

    cadastrar = () => {    
        
        const { nome, email, senha, senhaRepeticao } = this.state

        const usuario = { nome, email, senha, senhaRepeticao }

        try {
            this.service.validar(usuario);
        } catch(erro) {
            const msgs = erro.mensagem;
            msgs.forEach(element => {
                msgErro(element);
            });
            return false;
        }

        this.service.salvar(usuario)
            .then( response => {
                msgSucesso('Usuário cadastrado com sucesso! Faça o login para acessar o sistema.')
                this.props.history.push('/login');
            }).catch( error => {
                msgErro(error.response.data)
            })
    }

    cancelar = () => {
       this.props.history.push('/login') 
    }

    render() {
        return (
            <Card title="Cadastro de Usuário">            
                <div className="row">   
                    <div className="col-lg-12">
                        <div className="bs-component">
                            <FormGroup label="Nome: " htmlfor="inputNome">
                                <input type="text"id="inputNome" 
                                        name="nome" value={this.state.nome} 
                                        className="form-control"
                                        onChange={e => this.setState({nome: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Email: " htmlfor="inputEmail">
                                <input type="email"id="inputEmail" 
                                        name="email" value={this.state.email} 
                                        className="form-control"
                                        onChange={e => this.setState({email: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Senha: " htmlfor="inputSenha">
                                <input type="password"id="inputSenha" 
                                        name="senha" value={this.state.senha} 
                                        className="form-control"
                                        onChange={e => this.setState({senha: e.target.value})} />
                            </FormGroup>

                            <FormGroup label="Confirme a senha: " htmlfor="inputSenhaRepeticao">
                                <input type="password"id="inputSenhaRepeticao" 
                                        name="senhaRepeticao" value={this.state.senhaRepeticao} 
                                        className="form-control"
                                        onChange={e => this.setState({senhaRepeticao: e.target.value})} />
                            </FormGroup>

                            <button onClick={this.cadastrar} 
                                    type="button" 
                                    className="btn btn-success"> 
                                <i className="pi pi-save"></i> Salvar 
                            </button>

                            <button onClick={this.cancelar} 
                                    type="button" 
                                    className="btn btn-danger"> 
                                <i className="pi pi-times"></i> Cancelar 
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroUsuario);