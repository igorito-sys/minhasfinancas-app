import React from "react";

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";

import LancamentoService from "../../app/service/lancamentoService"
import LocalStorageService from "../../app/service/localStorageService"

import { withRouter } from 'react-router-dom'
import * as messages from '../../components/toastr'

class CadastroLancamentos extends React.Component {

    state = {
        id: null,
        descricao: '',
        valor: '',
        mes: '',
        ano: '',
        tipo: '',
        status: '',
        usuario: null,
        atualizando: false
    }

    constructor() {
        super()
        this.service = new LancamentoService()
    }

    componentDidMount() {
        const params = this.props.match.params
        if(params.id) {
            this.service.obterPorId(params.id)
                        .then( response => {
                            this.setState({...response.data, atualizando: true})
                        }).catch( erro => {
                            messages.msgErro(erro.response.data)
                        })
        }
    }

    submit = () => {
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const { descricao, valor, mes, ano, tipo } = this.state
        const lancamento = { descricao, valor, mes, ano, tipo, usuario: usuarioLogado.id }
        
        try {
            this.service.validar(lancamento)
        } catch(erro) {
            const mensagens = erro.mensagens
            mensagens.forEach(msg => messages.msgErro(msg))
            return false
        }

        this.service
                .salvar(lancamento)
                .then( response => {
                    this.props.history.push('/consulta-lancamentos')
                    messages.msgSucesso('Lancamento salvo com sucesso!')
                }).catch( erro => {
                    messages.msgErro(erro.response.data)
                })
    }

    atualizar = () => {
        const { descricao, valor, mes, ano, tipo, status, id, usuario } = this.state
        const lancamento = { descricao, valor, mes, ano, tipo, status, id, usuario }

        this.service
                .atualizar(lancamento)
                .then( response => {
                    this.props.history.push('/consulta-lancamentos')
                    messages.msgSucesso('Lancamento atualizado com sucesso!')
                }).catch( erro => {
                    messages.msgErro(erro.response.data)
                })
    }

    handleChange = (event) => {
        const value = event.target.value
        const name = event.target.name

        this.setState({ [name]: value })
    }

    render() {

        const tipos = this.service.obterListaDeTipo();
        const meses = this.service.obterListaDeMeses();

        return (
            <Card title={this.state.atualizando ? "Atualização de Lançamento" : "Cadastro de Lançamento"}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup id="inputDescricao" label="Descrição: ">
                            <input id="inputDescricao" 
                                   type="text"
                                   name="descricao"
                                   value={this.state.descricao} 
                                   className="form-control"
                                   onChange={this.handleChange} />
                        </FormGroup>    
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: ">
                            <input id="inputAno" 
                                   type="text"
                                   name="ano"
                                   value={this.state.ano} 
                                   className="form-control"
                                   onChange={this.handleChange} />
                        </FormGroup>
                    </div>

                    <div className="col-md-6">
                        <FormGroup id="inputMes" label="Mês: ">
                            <SelectMenu id="inputMes" 
                                        name="mes"
                                        value={this.state.mes} 
                                        lista={meses} 
                                        className="form-control"
                                        onChange={this.handleChange}  />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-4">
                        <FormGroup id="inputValor" label="Valor: ">
                            <input id="inputValor" 
                                   type="text"
                                   name="valor"
                                   value={this.state.valor}
                                   className="form-control"
                                   onChange={this.handleChange} />
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                        <FormGroup id="inputTipo" label="Tipo: ">
                            <SelectMenu id="InputTipo"
                                        name="tipo"
                                        value={this.state.tipo}
                                        lista={tipos} 
                                        className="form-control"
                                        onChange={this.handleChange} />
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                        <FormGroup id="inputStatus" label="Status: ">
                            <input id="inputStatus" 
                                   type="text"
                                   name="status"
                                   value={this.state.status}
                                   className="form-control"
                                   disabled />
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        {this.state.atualizando ?
                            (
                                <button onClick={this.atualizar} 
                                        className="btn btn-success"> 
                                    <i className="pi pi-refresh"></i> Atualizar 
                                </button>

                            ) : (

                                <button onClick={this.submit} 
                                        className="btn btn-success"> 
                                    <i className="pi pi-save"></i> Salvar 
                                </button>
                            )
                        }  

                        <button onClick={e => this.props.history.push('/consulta-lancamentos')} 
                                className="btn btn-danger">
                            <i className="pi pi-times"></i> Cancelar 
                        </button>
                    </div>
                </div>
            </Card>
        )

    }

}

export default withRouter(CadastroLancamentos);