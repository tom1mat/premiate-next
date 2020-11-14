import React from 'react';
import jsCookie from 'js-cookie';
import { Checkbox, notification } from 'antd';
import getConfig from 'next/config';

import { Context } from '../context';

const { publicRuntimeConfig: { __API_URL } } = getConfig();

class LoginButton extends React.PureComponent {
  state = {
    isSignedIn: false,
    hasAcceptedTerms: false,
    loading: false,
  }

  setCookie = (jwtToken) => {
    jsCookie.set('jwtToken', jwtToken, { secure: true, sameSite: 'None', expires: 7 });
  }

  fetchLogIn = async (email, password) => {
    this.setState({ loading: true });
    let url = `${__API_URL}/usuarios/${email}`;
    if (password) url += `?password=${password}`;
    const res = await fetch(url);
    if (res.status === 200) {
      const userData = await res.json();
      this.setCookie(userData.jwtToken);
      window.location.reload();
    } else {
      const { message } = await res.json();
      //El usuario no existe
      notification.warning({
        placement: 'bottomRight',
        message: message || 'Error, no se pudo loguear, intente mas tarde',
      });
    }
    this.setState({ loading: false });
  }

  onHandleGoogleLogIn = (auth2) => {
    auth2.signIn().then(async () => {
      const email = auth2.currentUser.get().getBasicProfile().getEmail();
      this.fetchLogIn(email);
    });
  };

  onHandleLogOut = (auth2) => {
    auth2.signOut().then(() => {
      jsCookie.remove('jwtToken');
      window.location.reload();
    });
  };

  onHandleCreateUserFromGoogle = (ev, auth2) => {
    ev.preventDefault();
    if (this.state.hasAcceptedTerms) {
      auth2.signIn().then(async () => {
        this.setState({ loading: true });
        const profile = auth2.currentUser.get().getBasicProfile();
        const body = JSON.stringify({
          googleData: {
            avatar: profile.getImageUrl(),
            googleId: profile.getId(),
            userName: profile.getName(),
          },
          surname: profile.getFamilyName(),
          name: profile.getGivenName(),
          email: profile.getEmail(),
        });
        const res = await fetch(`${__API_URL}/usuarios?origen=google`, {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          const userData = await res.json();
          this.setCookie(userData.jwtToken);
          window.location.reload();
        } else {
          const { message } = await res.json()
          notification.warning({
            placement: 'bottomRight',
            message,
          });
        }

        this.setState({ loading: false });
      });
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debe aceptar los términos',
      });
    }
  }

  onHandleCreateUser = async (ev) => {
    ev.preventDefault();
    if (this.state.hasAcceptedTerms) {
      const { createEmail, createPassword } = this.state;
      if (createEmail && createPassword) {
        this.setState({ loading: true });
        const body = JSON.stringify({
          email: this.state.createEmail,
          password: this.state.createPassword,
        });
        const res = await fetch(`${__API_URL}/usuarios`, {
          method: 'POST',
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          const userData = await res.json();
          this.setCookie(userData.jwtToken);
          window.location.reload();
        } else {
          const { message } = await res.json()
          notification.warning({
            placement: 'bottomRight',
            message,
          });
        }
        this.setState({ loading: false });
      } else {
        notification.warning({
          placement: 'bottomRight',
          message: 'Debe ingresar un usuario y contraseña',
        });
      }
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debe aceptar los términos',
      });
    }
  }

  onHandleLogin = (ev, auth2) => {
    ev.preventDefault();
    const { loginEmail, loginPassword } = this.state;
    if (loginEmail && loginPassword) {
      this.fetchLogIn(loginEmail, loginPassword);
    } else {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debe ingresar un usuario y contraseña',
      });
    }
  }

  onHandleChangeLoginEmail = (ev) => {
    this.setState({
      loginEmail: ev.target.value,
    });
  }

  onHandleChangeLoginPassword = (ev) => {
    this.setState({
      loginPassword: ev.target.value,
    });
  }

  onHandleChangeCreateEmail = (ev) => {
    this.setState({
      createEmail: ev.target.value,
    });
  }

  onHandleChangeCreatePassword = (ev) => {
    this.setState({
      createPassword: ev.target.value,
    });
  }

  onHandleTermsChange = (ev) => {
    this.setState({ hasAcceptedTerms: ev.target.checked });
  }

  render() {
    return (
      <Context.Consumer>
        {
          ({ usuario, auth2 }) => {
            if (this.state.loading) return <i className="fas fa-circle-notch fa-spin"></i>;

            return usuario ? (
              <>
                {
                  <span className="nav-link">Hola {usuario.email}!</span>
                }
                <div className="nav-link credits-container"><i className="fas fa-money-bill-wave"></i>{usuario.credits - usuario.creditsUsed}</div>
                <a href="/perfil" className="nav-link js-scroll-trigger">Mi perfil</a>
                <a className={`nav-link js-scroll-trigger ${!auth2 ? 'nav-link--disabled' : ''}`} onClick={() => this.onHandleLogOut(auth2)} href="#contact">LOG OUT</a>
              </>
            ) : (
                <>
                  <div className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Crear cuenta
                      </button>
                    <div className="dropdown-menu login-box" aria-labelledby="navbarDropdown">
                      <button className="nav-link js-scroll-trigger text-gray" disabled={!auth2} onClick={(ev) => this.onHandleCreateUserFromGoogle(ev, auth2)}>Crear desde <i className="fab fa-google"></i></button>
                      <div className="dropdown-divider"></div>
                      <form>
                        <input className="login-input" type="text" placeholder="Email" onChange={this.onHandleChangeCreateEmail} />
                        <input className="login-input" type="password" placeholder="Contraseña" onChange={this.onHandleChangeCreatePassword} />
                        <Checkbox onChange={this.onHandleTermsChange}>
                          Acepto los <a href="politicas.html" target="_blank">términos</a>
                        </Checkbox>
                        <button className="btn btn-success login-button" onClick={this.onHandleCreateUser}>Crear</button>
                      </form>
                    </div>
                  </div>
                  <div className="nav-item dropdown">
                    <button className="nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Ingresar
                     </button>
                    <div className="dropdown-menu login-box" aria-labelledby="navbarDropdown">
                      <button className="nav-link js-scroll-trigger text-gray" disabled={!auth2} onClick={() => this.onHandleGoogleLogIn(auth2)}>Entrar desde <i className="fab fa-google"></i></button>
                      <div className="dropdown-divider"></div>
                      <form>
                        <input className="login-input" type="text" placeholder="Email" onChange={this.onHandleChangeLoginEmail} />
                        <input className="login-input" type="password" placeholder="Contraseña" onChange={this.onHandleChangeLoginPassword} />
                        <button className="btn btn-success login-button" onClick={this.onHandleLogin}>Entrar</button>
                      </form>
                    </div>
                  </div>
                </>
              )
          }
        }
      </Context.Consumer>
    );
  }
}

export default LoginButton;
