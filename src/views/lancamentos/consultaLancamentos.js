import React from "react";
import { withRouter } from 'react-router-dom'

import Card from "../../components/card"
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamentosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localStorageService";

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
 
class ConsultaLancamentos extends React.Component {

    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();
        this.service = new LancamentoService()
    }

    buscar = () => {
        if(!this.state.ano) {
            messages.msgErro('O preenchimento do campo "Ano" é obrigatorio!')
            return false;
        }

        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.service
            .consultar(lancamentoFiltro)
            .then( response => {
                const lista = response.data;

                if(lista.length < 1) {
                    messages.msgAlerta('Nenhum resultado encontrado!')
                }
                this.setState({lancamentos: lista})
            }).catch( erro => {
                console.log(erro)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abrirConfirmação = (lancamento) => {
        this.setState({ showConfirmDialog: true, lancamentoDeletar: lancamento })
    } 

    cancelarDelecao = () => {
        this.setState({ showConfirmDialog: false, lancamentoDeletar: {} })
    }

    deletar = () => {
        this.service
                .deletar(this.state.lancamentoDeletar.id)
                .then( response => {
                    const lancamentos = this.state.lancamentos
                    const index = lancamentos.indexOf(this.state.lancamentoDeletar.id)
                    lancamentos.splice(index, 1)
                    this.setState({ lancamentos: lancamentos, showConfirmDialog: false })
                    messages.msgSucesso('Lancamento deletado com sucesso!')
                }).catch( erro => {
                    messages.msgErro('Ocorreu um erro ao tentar deletar o lancamento!')
                })
    }

    preparaFormulariocadastro = () => {
        this.props.history.push('/cadastro-lancamentos')
    }

    alterarStatus = (lancamento, status) => {
        this.service
            .alterarStatus(lancamento.id, status)
            .then(response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);

                if(index !== -1) {
                    lancamento['status'] = status;
                    lancamentos[index] = lancamento;
                    this.setState({lancamentos});
                }

                messages.msgSucesso("Status atualizado com sucesso!")
            })
    }

    render() {
        const meses = this.service.obterListaDeMeses();
        const tipo = this.service.obterListaDeTipo();

        const confirmDialogFooter = (
            <div>
                <Button label="Sim" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Não" icon="pi pi-times" onClick={this.cancelarDelecao} className="p-button-secondary" />
            </div>
        )

        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">
                            <FormGroup label="Ano: " htmlfor="inputAno">
                                <input type="text" 
                                    className="form-control" 
                                    id="inputAno"
                                    value={this.state.ano} 
                                    onChange={ e => this.setState({ano: e.target.value})}
                                    placeholder="Digite o ano" />
                            
                            </FormGroup>

                            <FormGroup htmlfor="inputMes" label="Mês: ">
                                <SelectMenu id="inputMes" 
                                            className="form-control" 
                                            value={this.state.mes} 
                                            onChange={ e => this.setState({mes: e.target.value})}
                                            lista={meses} />
                            </FormGroup>

                            <FormGroup htmlfor="inputDesc" label="Descrição: ">
                                <input id="inputDesc" 
                                        className="form-control" 
                                        type="text"
                                        value={this.state.descricao} 
                                        onChange={ e => this.setState({descricao: e.target.value})}
                                        placeholder="Digite a descrição" />
                            </FormGroup>

                            <FormGroup htmlfor="inputTipo" label="Tipo: ">
                                <SelectMenu id="inputTipo" 
                                            className="form-control" 
                                            value={this.state.tipo} 
                                            onChange={ e => this.setState({tipo: e.target.value})}
                                            lista={tipo} />
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success"> 
                                <i className="pi pi-search"></i> Buscar 
                            </button>

                            <button onClick={this.preparaFormulariocadastro} 
                                    type="button" 
                                    className="btn btn-danger"> 
                                <i className="pi pi-plus"></i> Cadastrar 
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="bs-component">
                            <LancamentosTable lancamentos={this.state.lancamentos}
                                              deletarAction={this.abrirConfirmação}
                                              editarAction={this.editar}
                                              alterarStatus={this.alterarStatus} />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação"
                            visible={this.state.showConfirmDialog}
                            style={{width: '50vw'}}
                            footer={confirmDialogFooter}
                            modal={true}
                            onHide={() => this.setState({showConfirmDialog: false})}>
                        Confirma a exclusão deste lançamento?
                    </Dialog>

                </div>
            </Card>
        )
    }

}

export default withRouter(ConsultaLancamentos);