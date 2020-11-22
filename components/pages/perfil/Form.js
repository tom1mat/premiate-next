import React, { useContext, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  notification,
} from 'antd';

import ButtonMercadoPago from '../../commons/ButtonMercadoPago';
import { Context } from '../../context';
import { useFetchData } from '../../../helpers/client';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const ProfileForm = () => {
  const { usuario } = useContext(Context);
  const fetchData = useFetchData();

  const handleSubmit = async e => {
    e.preventDefault();

    const {
      name: { value: name },
      surname: { value: surname },
      email: { value: email }
    } = e.target;

    const data = { name, surname, email };

    const ok = await fetchData(`usuarios/${usuario.email}`, data, 'PUT');
    console.log('ok: ', ok)

    if (ok) {
      notification.success({
        placement: 'bottomRight',
        message: 'Los datos se han editado exitosamente!',
      });
    } else {
      notification.error({
        placement: 'bottomRight',
        message: 'Error, no se han podido editar los datos',
      });
    }
  };

  if (!usuario) return 'El usuario no esta logueado';

  const { name, surname, email, googleData } = usuario;
  const avatar = (googleData && googleData.avatar ? googleData.avatar : null);

  return (
    <>
      <Card
        hoverable
        className="card-profile"
        cover={avatar ? <img alt="avatar" className="google-avatar" src={avatar} /> : null}
      >
        <Form {...formItemLayout} onSubmit={handleSubmit} className="profile-form" hideRequiredMark>
          <Form.Item label="Nombre">
            <Input name="name" defaultValue={name} />
          </Form.Item>
          <Form.Item label="Apellido">
            <Input name="surname" defaultValue={surname} />
          </Form.Item>
          <Form.Item label="Email">
            <Input name="email" defaultValue={email} />
          </Form.Item>
          <Button className="card-profile__submit" type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form>
        <ButtonMercadoPago text="Cargar 100 credits" amount={100} email={usuario.email} />
        <ButtonMercadoPago text="Cargar 500 credits" amount={500} email={usuario.email} />
        <ButtonMercadoPago text="Cargar 1000 credits" amount={1000} email={usuario.email} />
      </Card>
    </>
  );
}

export default ProfileForm;
