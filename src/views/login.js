import React from "react"

import Card from "../components/card";
import FormGroup from "../components/form-group";

class Login extends React.Component {

    state = {
        email: '',
        senha: ''
    }

    entrar = () => {
        console.log("Email: ", this.state.email)
        console.log("Senha: ", this.state.senha)
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6" style={ {position : 'relative', left : '300px'}}>
                        <div className="bs-docs-section">
                            <Card title="Login">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="bs-component">
                                            <fieldset>
                                                <FormGroup label="Email: " htmlfor="exampleInputEmail1">
                                                <input type="email" className="form-control" 
                                                       value={this.state.email}
                                                       onChange={e => this.setState({email: e.target.value})}
                                                       id="exampleInputEmail1" 
                                                       aria-describedby="emailHelp"
                                                       placeholder="Digite o email!" />
                                                </FormGroup>

                                                <FormGroup label="Senha: " htmlfor="exampleInputPassword1">
                                                <input type="email" className="form-control" 
                                                       value={this.state.senha}
                                                       onChange={e => this.setState({senha: e.target.value})}
                                                       id="exampleInputPassword1" 
                                                       placeholder="Digite a senha!" />
                                                </FormGroup>

                                                <button onClick={this.entrar} className="btn btn-success"> Login </button>
                                                <button className="btn btn-danger"> Cadastrar </button>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;