import React, { useState, useEffect } from 'react';
import { notification, Button, Input } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  RetweetOutlined,
} from '@ant-design/icons';

import { useFetchData } from '../../../helpers/client';

const PageUsuarios = ({ usuarios: _usuarios }) => {
  const [usuarios, setUsuarios] = useState(_usuarios);
  const [loading, setLoading] = useState(false);
  const fetchData = useFetchData();

  useEffect(() => {
    setUsuarios(_usuarios);
  }, [_usuarios]);

  const updateUsuario = async event => {
    event.preventDefault();
    setLoading(true);

    const emailUpdate = event.target.emailUpdate.value;

    const {
      name: { value: name },
      surname: { value: surname },
      email: { value: email },
      password: { value: password },
      credits: { value: credits },
    } = event.target;

    const userData = { name, surname, email, password, credits };

    if (!userData.password) delete userData.password;

    const data = await fetchData(`usuarios/${emailUpdate}`, userData, 'PUT');

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
    const confirm = window.confirm('Seguro que desea eliminar el usuario?');

    if (confirm) {
      setLoading(true);
      const target = event.currentTarget;

      const emailUpdate = target.value;
      const response = await fetchData(`usuarios/${emailUpdate}`, {}, 'DELETE');
      const notif = {
        type: 'info',
        message: `El usuario ha sido eliminado correctamente`
      };

      if (response) {
        const form = target.parentNode;
        form.parentNode.removeChild(form);
      } else {
        notif.type = 'warning';
        notif.message = `No se pudo eliminar el usuario ${emailUpdate}`;
      }

      const { type, message } = notif;

      setLoading(false);
      notification[type]({
        placement: 'bottomRight',
        message: message,
      });
    }
  };

  const reiniciarPublicidad = async event => {
    event.persist();
    event.preventDefault();
    const confirm = window.confirm('Seguro que desea reiniciar las publicidades?');

    if (confirm) {
      setLoading(true);
      const target = event.currentTarget;

      const emailUpdate = target.value;
      const response = await fetchData(`usuarios/${emailUpdate}`, { resetPublicidad: true }, 'PUT');
      const notif = {
        type: 'info',
        message: 'Las publicidad se han reiniciado'
      };

      if (!response) {
        notif.type = 'warning';
        notif.message = 'Error, no se pudo reiniciar las publicidades';
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
            <input required placeholder="Email" defaultValue={email} type="email" name="email" />
            <input required placeholder="Nombre" defaultValue={name} type="text" name="name" />
            <input placeholder="Contraseña" type="password" name="password" />
            <input required placeholder="Apellido" defaultValue={surname} type="text" name="surname" />
            <input required placeholder="Credits" defaultValue={credits} type="number" name="credits" />
            <input type="hidden" value={email} name="emailUpdate" />
            <Button
              htmlType="submit"
              type="primary"
              disabled={loading}
              shape="round"
              icon={<EditOutlined />}
              size="default"
              className="button-edit"
            >
              Editar
            </Button>
            <Button value={email} onClick={deleteusuario} type="primary" disabled={loading} shape="round" icon={<DeleteOutlined />} danger size="default">
              Eliminar
            </Button>
            <Button value={email} onClick={reiniciarPublicidad} type="primary" disabled={loading} shape="round" icon={<RetweetOutlined />} size="default">
              Reiniciar publicidades
            </Button>
          </form>
        ))
      }
    </div>
  )
};

export default PageUsuarios;
