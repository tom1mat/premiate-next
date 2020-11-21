import React, { useState } from 'react';
import { notification, Button, Input } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
} from '@ant-design/icons';

import getConfig from 'next/config';

import SelectStatus from './SelectStatus';
import { useFetchData } from '../../../helpers/client';

const { publicRuntimeConfig: { __IMAGENES_PUBLIC_PATH } } = getConfig();

const PageSorteos = ({ sorteos: _sorteos }) => {
  const [sorteos, setSorteos] = useState(_sorteos);
  const [loading, setLoading] = useState(false);
  const fetchData = useFetchData();

  const updateImageSorteo = (idSorteo, image) => {
    const newSorteos = [];
    let newSorteo = {};
    for (let i = 0; i < sorteos.length; i++) {
      if (sorteos[i]._id === idSorteo) {
        newSorteo = { ...sorteos[i] };
        newSorteo.image = image;
        newSorteos.push(newSorteo);
      } else {
        newSorteos.push(sorteos[i])
      }
    }

    setSorteos(newSorteos);
  };

  const updateSorteo = async event => {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData(event.target);

    if (!event.target.image.value) formData.delete('image');

    const config = {
      method: 'PUT',
      body: formData,
      headers: {},
    };

    const { sorteo: { value: sorteo }, _id: { value: id } } = event.target.elements;

    const response = await fetch(`api/sorteos/${id}`, config);

    const notif = {
      type: 'info',
      message: `El sorteo ${sorteo} se ha editado correctamente`
    };

    if (response.ok) {
      const data = await response.json();
      if (data.image) {
        updateImageSorteo(id, data.image);
      }
    } else {
      notif.type = 'warning';
      notif.message = `No se pudo editar el sorteo ${sorteo}`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  };

  const createSorteo = async event => {
    event.preventDefault();
    event.persist();
    setLoading(true);
    console.log(event.target)

    const formData = new FormData(event.target);

    const newSorteo = await fetchData('sorteos', formData, 'POST', 'formData');
    const notif = {
      type: 'info',
      message: `El sorteo se ha creado correctamente`
    };

    if (newSorteo) {
      setSorteos([
        ...sorteos,
        { _id: newSorteo._id, sorteo: event.target.sorteo.value, status: event.target.status.value, image: newSorteo.image }
      ]);
      event.target.reset();
    } else {
      notif.type = 'warning';
      notif.message = `No se pudo crear el sorteo`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  };

  const deleteSorteo = async event => {
    event.persist();
    event.preventDefault();
    const confirm = window.confirm('Seguro que desea eliminar el sorteo?');

    if (confirm) {
      setLoading(true);

      const target = event.currentTarget;

      const _id = target.value;
      const response = await fetchData(`sorteos/${_id}`, {}, 'DELETE');
      const notif = {
        type: 'info',
        message: `El sorteo ha sido eliminado correctamente`
      };

      const form = target.parentNode.parentNode;
      form.parentNode.removeChild(form);

      if (response) {
        // reFetchSorteos();
      } else {
        notif.type = 'warning';
        notif.message = `No se pudo eliminar el sorteo ${_id}`;
      }

      const { type, message } = notif;

      setLoading(false);
      notification[type]({
        placement: 'bottomRight',
        message: message,
      });
    }
  };

  const populateGanador = (sorteoId, ganador) => {
    const sorteosConGanador = sorteos.map(sorteo => {
      if (sorteo._id === sorteoId) {
        return {
          ...sorteo,
          ganador,
        };
      } else {
        return sorteo;
      }
    });

    setSorteos(sorteosConGanador);
  };

  const sortear = async (ev) => {
    ev.preventDefault();
    const sorteoId = ev.currentTarget.value;

    try {
      const { type, message, usuarioGanador } = await fetchData(`sorteos/sortear`, { sorteoId }, 'POST');

      if (type === 'success') {
        populateGanador(sorteoId, usuarioGanador);
      }

      notification[type]({
        placement: 'bottomRight',
        message,
      });
    } catch (error) {
      console.log(type, message)
      console.log(error)
      notification.error({
        placement: 'bottomRight',
        message: 'Error no reconocido',
      });
    }
  }

  return (
    <>
      <div>
        <form className="form" id="formCreate" onSubmit={createSorteo}>
          <div className="form__title">Nuevo sorteo</div>
          <Input name="sorteo" required placeholder="Nombre del sorteo" />
          <div className="form__container">
            <SelectStatus />
            <input type="file" name="image" required />
          </div>
          {/* <input name="sorteo" required /> */}
          <Button
            className="form__button-create"
            type="primary"
            disabled={loading}
            shape="round"
            icon={<PlusOutlined />}
            size="default"
            htmlType="submit"
          >
            Crear
          </Button>
        </form>
      </div>
      <div>
        <div style={{ fontSize: 18, marginLeft: '10%' }}>Sorteos ingresados</div>
        {
          sorteos.map(({ _id, sorteo, image, status, users, ganador }) => (
            <form key={_id} className="sorteos-grid" key={_id} onSubmit={updateSorteo} method="POST">
              {image && <img width="50" height="50" alt="sorteo" src={`${__IMAGENES_PUBLIC_PATH}sorteos/${image}`} />}
              <Input style={{ height: 32 }} defaultValue={sorteo} name="sorteo" required placeholder="Nombre del sorteo" />
              {/* <input defaultValue={sorteo} name="sorteo" required /> */}
              <SelectStatus defaultValue={status} />
              <input type="hidden" value={_id} name="_id" />
              <input type="file" name="image" />
              <div className="button-container">
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
                <Button value={_id} onClick={deleteSorteo} type="primary" disabled={loading} shape="round" icon={<DeleteOutlined />} danger size="default">
                  Eliminar
                  </Button>
                <Button value={_id} onClick={sortear} type="primary" disabled={status === 'FINISHED' || loading} shape="round" icon={<GiftOutlined />} size="default">
                  Sortear
                </Button>
              </div>
              {
                ganador ? (
                  <div>Ganador: {ganador.email}</div>
                ) : (
                    users && (
                      <div>
                        <div>Participantes</div>
                        <ul>
                          {
                            Object.values(users).map(user => (
                              <li key={user._id}>{user.email}</li>
                            ))
                          }
                        </ul>
                      </div>
                    )
                  )
              }
            </form>
          ))
        }
      </div>
    </>
  )
};

export default PageSorteos;
