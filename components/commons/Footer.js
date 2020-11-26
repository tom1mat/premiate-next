import React from 'react';

export default () => <footer className="footer">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-md-4">
        <span className="copyright">Copyright &copy; Premiate 2020</span>
      </div>
      <div className="col-md-4">
        <ul className="list-inline social-buttons">
          <li className="list-inline-item">
            <a target="_blank" rel="noopener noreferrer" href="https://instagram.com/premiateok">
              <i className="fab fa-instagram"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="col-md-4">
        <ul className="list-inline quicklinks">
          <li className="list-inline-item">
            <a target="_blank" href="politicas.html">Políticas de privacidad</a>
            <span style={{ margin: '0 15px' }}>|</span>
            <a href="/archivos/app-premiate-android-1.0.3.apk" download="app-premiate-android-1.0.3.apk">Descargar app</a>
            <img style={{ width: 25, marginLeft: 10 }} src="/img/logo_android.png" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</footer>
