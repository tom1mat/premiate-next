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

const getValidationErrorMsg = (dateString) => {
  const dateStamp = new Date(dateString).getTime();
  if (!dateStamp) return 'Formato de fecha inválido';
  if (dateStamp < new Date().getTime()) return 'La fecha debe ser futura';
  return false;
}

const PageSubastas = ({ subastas: _subastas }) => {
  const [subastas, setSubastas] = useState(_subastas);
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
    const dateErrorMessage = getValidationErrorMsg(event.target.dateString.value);
    if (dateErrorMessage) {
      return notification.warning({
        placement: 'bottomRight',
        message: dateErrorMessage,
      });
    }

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
      message: `La subasta ${title} se ha editado correctamente`,
    };

    if (response.ok) {
      const data = await response.json();
      if (data.image) {
        updateImageSubasta(id, data.image);
      }
    } else if (response.status === 405) {
      notif.type = 'warning';
      notif.message = 'La fecha debe ser futura';
    } else if (response.status === 406) {
      notif.type = 'warning';
      notif.message = 'Solo puede haber una subasta activa al mismo tiempo';
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
    const dateErrorMessage = getValidationErrorMsg(event.target.dateString.value);
    if (dateErrorMessage) {
      return notification.warning({
        placement: 'bottomRight',
        message: dateErrorMessage,
      });
    }
    setLoading(true);

    const formData = new FormData(event.target);

    const data = await fetchData('subastas', formData, 'POST', 'formData');
    const notif = {
      type: 'info',
      message: `La subasta se ha creado correctamente`
    };

    if (data.isError) {
      notif.type = 'warning';
      notif.message = data.message || 'No se pudo crear La subasta';
    } else {
      const {
        title: { value: title },
        status: { value: status },
        dateString: { value: dateString },
      } = event.target;
      setSubastas([
        ...subastas,
        { _id: data._id, title, status, image: data.image, dateString, }
      ]);
      event.target.reset();
    }

    // if (newSubasta) {
    //   const {
    //     title: { value: title },
    //     status: { value: status },
    //     dateString: { value: dateString },
    //   } = event.target;
    //   setSubastas([
    //     ...subastas,
    //     { _id: newSubasta._id, title, status, image: newSubasta.image, dateString, }
    //   ]);
    //   event.target.reset();
    // } else {
    //   notif.type = 'warning';
    //   notif.message = `No se pudo crear La subasta`;
    // }

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

      const target = event.currentTarget;
      const _id = target.value;
      const response = await fetchData(`subastas/${_id}`, {}, 'DELETE');
      const notif = {
        type: 'success',
        message: `La subasta ha sido eliminado correctamente`
      };

      const form = target.parentNode.parentNode;
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
    const target = ev.currentTarget;
    const subastaId = target.value;
    try {
      const { type, message } = await fetchData(`subastas/finalizar`, { subastaId }, 'POST');

      if (type === 'success') {
        window.location.reload();
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
        <form className="form" id="formCreate" method="POST" onSubmit={createSubasta} encType="multipart/form-data">
          <div className="form__title">Nueva subasta</div>
          <Input name="title" required placeholder="Nombre de la subasta" />
          <div className="form__container">
            <input placeholder="AAAA-MM-DDTHH:MM:SS" type="datetime-local" name="dateString" />
            <input type="file" name="image" required />
            <SelectStatus />
          </div>
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
        <div style={{ fontSize: 18 }}>Subastas ingresadas</div>
        {
          subastas.map(({ _id, title, dateString, image, status, ganador }) => {
            const isFinished = status === 'FINISHED';
            return (
              <React.Fragment key={_id}>
                <form className="subastas-grid" key={_id} onSubmit={updateSubasta} method="POST">
                  {image && <img width="50" height="50" alt="subasta" src={`${__IMAGENES_PUBLIC_PATH}subastas/${image}`} />}
                  <Input disabled={isFinished} style={{ height: 32 }} defaultValue={title} name="title" required placeholder="Nombre de la subasta" />
                  <input disabled={isFinished} placeholder="AAAA-MM-DDTHH:MM:SS" type="datetime-local" name="dateString" defaultValue={dateString} />
                  <SelectStatus disabled={isFinished} defaultValue={status} />
                  <input disabled={isFinished} type="file" name="image" />
                  <div className="button-container">
                    <Button
                      htmlType="submit"
                      type="primary"
                      disabled={loading || isFinished}
                      shape="round"
                      icon={<EditOutlined />}
                      size="default"
                      className="button-edit"
                    >
                      Editar
                  </Button>
                    <Button value={_id} onClick={deleteSubasta} type="primary" disabled={loading} shape="round" icon={<DeleteOutlined />} danger size="default">
                      Eliminar
                  </Button>
                    <Button value={_id} onClick={finalizarSubasta} type="primary" disabled={isFinished || loading} shape="round" icon={<GiftOutlined />} size="default">
                      Finalizar
                  </Button>
                  </div>
                  <input type="hidden" value={_id} name="_id" />
                  {
                    ganador && ['ACTIVE', 'FINISHED'].includes(status) && (
                    <div>{status === 'ACTIVE' ? 'Va ganando' : 'Ganador'}: {ganador.email}</div>
                    )
                  }
                </form>
              </React.Fragment>
            )
          }
          )
        }
      </div>
    </>
  )
};

export default PageSubastas;
