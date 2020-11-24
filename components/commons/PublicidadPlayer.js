import getConfig from 'next/config';
import React, { useEffect, useState, useContext } from 'react';
import ReactPlayer from 'react-player/file';
import { notification } from 'antd';

import { Context } from '../context';
import { useFetchData } from '../../helpers/client';

const { publicRuntimeConfig: { __VIDEOS_PUBLIC_PATH } } = getConfig();

const PublicidadPlayer = () => {
  const { setShowPublicidad, showPublicidad, publicidades, usuario } = useContext(Context);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(() => {
    if (!publicidades || !publicidades.length || publicidades.length === 0) return null;
    return publicidades[0];
  });
  const fetchData = useFetchData();

  useEffect(() => {
    setPlaying(showPublicidad);
    if (!usuario) {
      notification.info({
        placement: 'bottomRight',
        duration: 10,
        message: 'Debes ingresar primero!',
      });
    } else if (!current && showPublicidad) {
      notification.info({
        placement: 'bottomRight',
        duration: 10,
        message: 'Ya has visto todas las publicidades disponibles!',
      });
    }
  }, [showPublicidad]);

  useEffect(() => {
    if (showPublicidad) {
      document.getElementsByTagName('body')[0].style.position = 'fixed';
    } else {
      document.getElementsByTagName('body')[0].style.position = '';
    }
  }, [showPublicidad]);

  useEffect(() => {
    if (publicidades.length > 0) {
      setCurrent(publicidades[0]);
    } else {
      setCurrent(null);
    }
  }, [publicidades]);

  const handleOnEnded = async () => {
    const ok = fetchData(`publicidades/viewed`, { publicidadId: current._id, usuarioId: usuario._id }, 'POST');

    if (ok) {
      notification.success({
        placement: 'bottomRight',
        duration: 10,
        message: 'Has ganado 100 credits!',
      });
    }

    setPlaying(false);
    setCurrent(null);

    publicidades.forEach((publicidad, index) => {
      if (publicidad._id === current._id) {
        setCurrent(publicidades[index + 1]);
      }
    });
  }

  if (!showPublicidad || !current) return null;

  if (showPublicidad && current) {
    return (
      <div className="publicidad-player">
        <ReactPlayer
          className="publicidad-player__video"
          url={`${__VIDEOS_PUBLIC_PATH}${current.video}`}
          playing={playing}
          onEnded={handleOnEnded}
          controls={false}
          playsinline={true}
        />
        {
          !playing && (
            <div>
            <button onClick={() => setPlaying(true)}>Ver otra <span>+ 100 credits</span></button>
            <button onClick={() => setShowPublicidad(false)}>Cerrar</button>
          </div>
          )
        }
      </div>
    );
  }
}

export default PublicidadPlayer;
