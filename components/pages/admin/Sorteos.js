import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

import { __API_URL } from '../../../config/client';
import { fetchData } from '../../../helpers/client';

const PageSorteos = ({ sorteos: _sorteos, reFetchSorteos }) => {
  const [sorteos, setSorteos] = useState(_sorteos);
  const [loading, setLoading] = useState(false);
  console.log(sorteos);

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

    const data = await fetch(`api/sorteos/${id}`, config);
    // const { sorteo, status, _id } = event.target.elements;
    // const params = { sorteo: sorteo.value, status: status.value, _id: _id.value }
    // const data = await fetchData(`sorteos/${_id.value}`, params, 'PUT');
    const notif = {
      type: 'info',
      message: `El sorteo ${sorteo.value} se ha editado correctamente`
    };

    if (!data) {
      notif.type = 'warning';
      notif.message = `No se pudo editar el sorteo ${sorteo.value}`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  };

  const createSorteo = async event => {
    event.persist();
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    const newSorteo = await fetchData('sorteos', formData, 'POST', 'formData');
    const notif = {
      type: 'info',
      message: `El sorteo se ha creado correctamente`
    };
    console.log(newSorteo);
    if (newSorteo) {
      setSorteos([
        ...sorteos,
        { _id: newSorteo._id, sorteo: event.target.sorteo.value, status: event.target.status.value }
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
      const response = await fetchData(`sorteos/${_id}`, { }, 'DELETE');
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

  return (
    <>
      <div>
        <form id="formCreate" method="POST" onSubmit={createSorteo} encType="multipart/form-data">
          <input name="sorteo" required />
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
          sorteos.map(({ _id, sorteo, image, status }) => (
            <form key={_id} onSubmit={updateSorteo} method="POST">
              {image && <img width="50" height="50" alt="sorteo" src={`${__API_URL}premiate-uploads/${image}`} />}
              <input defaultValue={sorteo} name="sorteo" required />
              <select name="status" defaultValue={status}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="FINISHED">FINISHED</option>
              </select>
              <input type="hidden" value={_id} name="_id" />
              <input type="file" name="image" />
              <button type="submit" disabled={loading}>Editar</button>
              <button value={_id} onClick={deleteSorteo} disabled={loading}>Eliminar</button>
            </form>
          ))
        }
      </div>
    </>
  )
};

export default PageSorteos;
