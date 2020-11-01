import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import getConfig from 'next/config';
import { useFetchData } from '../../../helpers/client';

const { publicRuntimeConfig: { __API_URL } } = getConfig();
const STATUS = ["ACTIVE", "INACTIVE", "FINISHED"];

const PageSubastas = ({ subastas: _subastas, usuarios, reFetchSubastas }) => {
  const [loading, setLoading] = useState(false);
  const [subastas, setSubastas] = useState([])
  const fetchData = useFetchData();

  useEffect(() => {
    setSubastas(_subastas);
  },[_subastas]);

  const createSubasta = async event => {
    event.persist();
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    const newSorteo = await fetchData('subastas', formData, 'POST', 'formData');
    const notif = {
      type: 'info',
      message: `La subasta se ha creado correctamente`
    };

    if (newSorteo) {
      reFetchSubastas();
      event.target.reset();
    } else {
      notif.type = 'warning';
      notif.message = `No se pudo crear la subasta`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  }

  const updateSubasta = async event => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const data = await fetchData('subastas', formData, 'PUT', 'formData');
    const notif = {
      type: 'info',
      message: `La subasta se ha editado correctamente`
    };

    if (data) {
      reFetchSubastas();
    } else {
      notif.type = 'warning';
      notif.message = `No se pudo editar la subasta`;
    }

    const { type, message } = notif;

    setLoading(false);
    notification[type]({
      placement: 'bottomRight',
      message: message,
    });
  }

  const deleteSubasta = async event => {
    event.persist();
    event.preventDefault();

    const _id = event.target.value;
    const confirm = window.confirm(`Seguro que deseas eliminar la subasta ID: ${_id}?`);

    if (confirm) {
      setLoading(true);

      const response = await fetchData('subastas', { _id }, 'DELETE');
      const notif = {
        type: 'info',
        message: `La subasta ID: ${_id} ha sido eliminado correctamente`
      };

      if (response) {
        // reFetchSubastas();
      } else {
        notif.type = 'warning';
        notif.message = `No se pudo eliminar la subasta ID: ${_id}`;
      }

      const { type, message } = notif;

      setLoading(false);
      notification[type]({
        placement: 'bottomRight',
        message: message,
      });
    }
  }

  return (
    <>
      <div>
        <form id="formCreate" method="POST" onSubmit={createSubasta} encType="multipart/form-data">
          <input name="title" required />
          <input type="number" name="amount" required />
          <input type="datetime-local" name="dateString" />
          <select name="winnerId">
            {usuarios.map(({ _id, email }) => (
              <option key={_id} value={_id}>{ email }</option>
            ))}
          </select>
          <select name="status">
            {STATUS.map(s => (<option key={s} value={s}>{s}</option>))}
          </select>
          <input type="file" name="image" />
          <button type="submit" disabled={loading}>Crear</button>
        </form>
      </div>
      <div>
        {
          subastas.map(({ _id, title, image, winnerId, amount, dateString, status }) => (
            <form key={_id} onSubmit={updateSubasta} method="POST">
              {image && <img width="50" height="50" alt="subasta" src={`${__API_URL}premiate-uploads/${image}`} />}
              <input defaultValue={title} name="title" required />
              <input defaultValue={amount} type="number" name="amount" required />
              <input type="datetime-local" name="dateString" defaultValue={dateString} />
              <select defaultValue={winnerId} name="winnerId">
                {usuarios.map(({ _id, email }) => (
                  <option key={_id} value={_id}>{ email }</option>
                ))}
              </select>
              <select name="status" defaultValue={status}>
                {STATUS.map(s => (<option key={s} value={s}>{s}</option>))}
              </select>
              <input type="hidden" value={_id} name="_id" />
              <input type="file" name="image" />
              <button type="submit" disabled={loading}>Editar</button>
              <button value={_id} onClick={deleteSubasta} disabled={loading}>Eliminar</button>
            </form>
          ))
        }
      </div>
    </>
  )
};

export default PageSubastas;
