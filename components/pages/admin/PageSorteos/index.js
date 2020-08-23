import React, { useState, useEffect } from 'react';
import { notification } from 'antd';

import { __API_URL } from '../../../config';
import { fetchData } from '../../../utils';

const PageSorteos = ({ sorteos: _sorteos, reFetchSorteos }) => {
  const [sorteos, setSorteos] = useState(_sorteos);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setSorteos(_sorteos);
  },[_sorteos]);

  const updateSorteo = async event => {
    event.preventDefault();
    setLoading(true);
    const { sorteo, status, _id } = event.target.elements;
    const params = { sorteo: sorteo.value, status: status.value, _id: _id.value }
    const data = await fetchData('sorteo', params, 'PUT');
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

    const newSorteo = await fetchData('sorteo', formData, 'POST', 'formData');
    const notif = {
      type: 'info',
      message: `El sorteo se ha creado correctamente`
    };

    if (newSorteo) {
      reFetchSorteos();
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
    const confirm = window.confirm("Seguro que desea eliminar el sorteo?");

    if (confirm) {
      setLoading(true);

      const _id = event.target.value;
      const response = await fetchData('sorteo', { _id }, 'DELETE');
      const notif = {
        type: 'info',
        message: `El sorteo ha sido eliminado correctamente`
      };

      if (response) {
        reFetchSorteos();
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
