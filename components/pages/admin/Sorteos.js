import React, { useState, useEffect } from 'react';
import { notification, Button } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined,
} from '@ant-design/icons';

import getConfig from 'next/config';

import { useFetchData } from '../../../helpers/client';

const { publicRuntimeConfig: { __IMAGENES_PUBLIC_PATH } } = getConfig();

const PageSorteos = ({ sorteos: _sorteos, reFetchSorteos }) => {
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

      const target = event.target;
      const _id = target.value;
      const response = await fetchData(`sorteos/${_id}`, {}, 'DELETE');
      const notif = {
        type: 'info',
        message: `El sorteo ha sido eliminado correctamente`
      };

      const form = target.parentNode;
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
    const sorteoId = ev.target.value;
    try {
      const { type, message, usuarioGanador } = await fetchData(`sorteos/sortear`, { sorteoId }, 'POST');
      console.log( type, message)

      if (type === 'success') {
        populateGanador(sorteoId, usuarioGanador);
      }

      notification[type]({
        placement: 'bottomRight',
        message,
      });
    } catch (error) {
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
        <form id="formCreate" onSubmit={createSorteo} encType="multipart/form-data">
          <input name="sorteo" required />
          <select name="status">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="FINISHED">FINISHED</option>
          </select>
          <input type="file" name="image" required />
          <Button type="primary" disabled={loading} shape="round" icon={<PlusOutlined />} size="default">
            Crear
          </Button>
        </form>
      </div>
      <div>
        {
          sorteos.map(({ _id, sorteo, image, status, users, ganador }) => (
            <React.Fragment key={_id}>
              <form key={_id} onSubmit={updateSorteo} method="POST">
                {image && <img width="50" height="50" alt="sorteo" src={`${__IMAGENES_PUBLIC_PATH}sorteos/${image}`} />}
                <input defaultValue={sorteo} name="sorteo" required />
                <select name="status" defaultValue={status}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="FINISHED">FINISHED</option>
                </select>
                <input type="hidden" value={_id} name="_id" />
                <input type="file" name="image" />
                <Button
                  // onClick={(ev) => console.log(ev.currentTarget.parentElement.submit())}
                  htmlType="submit"
                  type="primary"
                  disabled={loading}
                  shape="round"
                  icon={<EditOutlined />}
                  size="default"
                >
                  Editar
                </Button>
                <Button value={_id} onClick={deleteSorteo} type="primary" disabled={loading} shape="round" icon={<DeleteOutlined />} danger size="default">
                  Eliminar
                </Button>
                <Button value={_id} onClick={sortear} type="primary" disabled={loading} shape="round" icon={<GiftOutlined />} size="default">
                  Sortear
                </Button>
              </form>
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
            </React.Fragment>
          ))
        }
      </div>
    </>
  )
};

export default PageSorteos;
