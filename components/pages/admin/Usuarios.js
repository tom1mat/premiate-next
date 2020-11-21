import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

import { useFetchData } from '../../../helpers/client';

const PageUsuarios = ({ usuarios: _usuarios }) => {
  const [usuarios, setUsuarios] = useState(_usuarios);
  const [loading, setLoading] = useState(false);
  const fetchData = useFetchData();

  useEffect(() => {
    setUsuarios(_usuarios);
  },[_usuarios]);

  const updateUsuario = async event => {
    event.preventDefault();
    setLoading(true);

    const _id = event.target._id;

    // const formData = new FormData(event.target);
    const {
      name: { value: name },
      surname: { value: surname },
      email: { value: email },
      password: { value: password },
      credits: { value: credits },
    } = event.target;

    const userData = { name, surname, email, password, credits };

    // if (!formData.get('password')) formData.delete('password');
    if (!userData.password) delete userData.password;

    const data = await fetchData(`usuarios/${_id}`, userData, 'PUT');

    const notif = {
      type: 'info',
      message: `El usuario se ha editado correctamente`
    };

    if (!data) {
      notif.type = 'warning';
      notif.message = `No se pudo editar el usuario`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  }

  const deleteusuario = async event => {
    event.persist();
    event.preventDefault();
    const confirm = window.confirm("Seguro que desea eliminar el usuario?");

    if (confirm) {
      setLoading(true);

      const _id = event.currentTarget.value;
      const response = await fetchData('usuario', { _id }, 'DELETE');
      const notif = {
        type: 'info',
        message: `El usuario ha sido eliminado correctamente`
      };

      if (response) {
        reFetchUsuarios();
      } else {
        notif.type = 'warning';
        notif.message = `No se pudo eliminar el usuario ${_id}`;
      }

      const { type, message } = notif;

      setLoading(false);
      notification[type]({
        placement: 'bottomRight',
        message: message,
      });
    }
  };

  return (
      <div>
        {
          usuarios.map(({ _id, name, email, surname, avatar, credits }) => (
            <form key={_id} onSubmit={updateUsuario} method="POST">
              {avatar && <img width="50" height="50" alt="usuario" src={avatar} />}
              <input defaultValue={name} type="text" name="name" />
              <input defaultValue={email} type="text" name="email" />
              <input type="password" name="password" />
              <input defaultValue={surname} type="text" name="surname" />
              <input defaultValue={credits} type="number" name="credits" />
              <input type="hidden" value={_id} name="_id" />
              <button type="submit" disabled={loading}>Editar</button>
              <button value={_id} onClick={deleteusuario} disabled={loading}>Eliminar</button>
            </form>
          ))
        }
      </div>
  )
};

export default PageUsuarios;
