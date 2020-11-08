import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import getConfig from 'next/config';

import { useFetchData } from '../../../helpers/client';

const { publicRuntimeConfig: { __IMAGENES_PUBLIC_PATH } } = getConfig();

const PageSubastas = ({ subastas: _subastas }) => {
  const [subastas, setSubastas] = useState(_subastas);
  console.log(subastas)
  const [loading, setLoading] = useState(false);
  const fetchData = useFetchData();

  const updateImageSubasta = (idSubasta, image) => {
    const newSubastas = [];
    let newSubasta = {};
    for (let i = 0; i < subastas.length; i++) {
      if (subastas[i]._id === idSubasta) {
        newSubasta = { ...subastas[i] };
        newSubasta.image = image;
        newSubastas.push(newSubasta);
      } else {
        newSubastas.push(subastas[i])
      }
    }

    setSubastas(newSubastas);
  };

  const updateSubasta = async event => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    if (!event.target.image.value) formData.delete('image');

    const config = {
      method: 'PUT',
      body: formData,
      headers: {},
    };

    const {
      title: { value: title },
      _id: { value: id },
    } = event.target.elements;

    const response = await fetch(`api/subastas/${id}`, config);

    const notif = {
      type: 'info',
      message: `La subasta ${title} se ha editado correctamente`
    };

    if (response.ok) {
      const data = await response.json();
      if (data.image) {
        updateImageSubasta(id, data.image);
      }
    } else {
      notif.type = 'warning';
      notif.message = `No se pudo editar la subasta ${title}`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  };

  const createSubasta = async event => {
    event.persist();
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    const newSubasta = await fetchData('subastas', formData, 'POST', 'formData');
    const notif = {
      type: 'info',
      message: `La subasta se ha creado correctamente`
    };

    if (newSubasta) {
      setSubastas([
        ...subastas,
        { _id: newSubasta._id, title: event.target.title.value, status: event.target.status.value, image: newSubasta.image }
      ]);
      event.target.reset();
    } else {
      notif.type = 'warning';
      notif.message = `No se pudo crear La subasta`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  };

  const deleteSubasta = async event => {
    event.persist();
    event.preventDefault();
    const confirm = window.confirm('Seguro que desea eliminar la subasta?');

    if (confirm) {
      setLoading(true);

      const target = event.target;
      const _id = target.value;
      const response = await fetchData(`subastas/${_id}`, {}, 'DELETE');
      const notif = {
        type: 'success',
        message: `La subasta ha sido eliminado correctamente`
      };

      const form = target.parentNode;
      form.parentNode.removeChild(form);

      if (!response) {
        notif.type = 'warning';
        notif.message = `No se pudo eliminar la subasta ${_id}`;
      }

      const { type, message } = notif;

      setLoading(false);
      notification[type]({
        placement: 'bottomRight',
        message: message,
      });
    }
  };

  const finalizarSubasta = async (ev) => {
    ev.preventDefault();
    ev.persist();
    const subastaId = ev.target.value;
    try {
      const { type, message } = await fetchData(`subastas/finalizar`, { subastaId }, 'POST');

      if (type === 'success') {
        const selectStatus = ev.target.parentElement.status;
        selectStatus.value = 'FINISHED';
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
        <form id="formCreate" method="POST" onSubmit={createSubasta} encType="multipart/form-data">
          <input name="title" required />
          <input placeholder="AAAA-MM-DDTHH:MM:SS" type="datetime-local" name="dateString" />
          <select name="status">
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="FINISHED">FINISHED</option>
          </select>
          <input type="file" name="image" />
          <button type="submit" disabled={loading}>Crear</button>
        </form>
      </div>
      <div>
        {
          subastas.map(({ _id, title, dateString, image, status, ganador }) => (
            <React.Fragment key={_id}>
              <form key={_id} onSubmit={updateSubasta} method="POST">
                {image && <img width="50" height="50" alt="subasta" src={`${__IMAGENES_PUBLIC_PATH}subastas/${image}`} />}
                <input defaultValue={title} name="title" required/>
                <input placeholder="AAAA-MM-DDTHH:MM:SS" type="datetime-local" name="dateString" defaultValue={dateString} />
                <select name="status" defaultValue={status}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="FINISHED">FINISHED</option>
                </select>
                <input type="hidden" value={_id} name="_id" />
                <input type="file" name="image" />
                <button type="submit" disabled={loading}>Editar</button>
                <button value={_id} onClick={deleteSubasta} disabled={loading}>Eliminar</button>
                <button value={_id} onClick={finalizarSubasta} disabled={loading}>Finalizar</button>
              </form>
              {
                ganador && (
                  <div>Ganador: {ganador.email}</div>
                )
              }
            </React.Fragment>
          ))
        }
      </div>
    </>
  )
};

export default PageSubastas;
