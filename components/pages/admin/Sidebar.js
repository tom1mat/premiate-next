import React from 'react';

const Sidebar = () => (
  <ul style={{ flex: '0 1 auto' }}>
    <li>
      <a href="/admin/sorteos">
        Sorteos
      </a>
    </li>
    <li>
      <a href="/admin/subastas">
        Subastas
      </a>
    </li>
    <li>
      <a href="/admin/usuarios">
        Usuarios
      </a>
    </li>
  </ul>
);

export default Sidebar;
