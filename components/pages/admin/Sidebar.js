import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <ul style={{ flex: '0 1 auto' }}>
    <li>
      <Link to="/panel/sorteos">
        Sorteos
      </Link>
    </li>
    <li>
      <Link to="/panel/subastas">
        Subastas
      </Link>
    </li>
    <li>
      <Link to="/panel/usuarios">
        Usuarios
      </Link>
    </li>
  </ul>
);

export default Sidebar;
