import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card, InputNumber, notification, Button } from 'antd';
import getConfig from 'next/config';

import { Context } from '../../context';

import ButtonMercadoPago from '../../commons/ButtonMercadoPago';

const { publicRuntimeConfig: { __SOCKETIO_SERVER, __IMAGENES_PUBLIC_PATH } } = getConfig();

const buildStartTimer = (secondsDiff) => {
  if (!secondsDiff > 0) {
    return [0, 0, 0, 0];
  }

  const daysDecimal = secondsDiff / 60 / 60 / 24;
  const days = Math.trunc(daysDecimal);

  const hoursDecimal = (daysDecimal - days) * 24;
  const hours = Math.trunc(hoursDecimal);

  const minutesDecimal = (hoursDecimal - hours) * 60;
  const minutes = Math.trunc(minutesDecimal);

  const secondsDecimal = (minutesDecimal - minutes) * 60;
  const seconds = Math.trunc(secondsDecimal);

  return [seconds, minutes, hours, days];
}

const getSecondsDiff = (date) => date.getTime() / 1000 - Date.now() / 1000;

const Subasta = ({ subasta }) => {
  const { usuario } = useContext(Context);

  const subastaDate = new Date(subasta.dateString);

  const [secondsDiff, setSecondsDiff] = useState(getSecondsDiff(subastaDate));
  const [_seconds, _minutes, _hours, _days] = buildStartTimer(secondsDiff);
  const [seconds, setSeconds] = useState(_seconds);
  const [minutes, setMinutes] = useState(_minutes);
  const [hours, setHours] = useState(_hours);
  const [days, setDays] = useState(_days);
  const [amount, setAmount] = useState(subasta.amount);
  const [localAmount, setLocalAmount] = useState(1);
  const [isRaiseButtonDisabled, setisRaIseButtonDisabled] = useState(false);
  const [creditsUsed, setCreditsUsed] = useState((usuario && usuario.creditsUsed) ? usuario.creditsUsed : 0);
  const [ganadorEmail, setGanadorEmail] = useState(subasta.ganador ? subasta.ganador.email : null);
  const [finishing, setFinishing] = useState(false);

  const setWarning = () => {
    setFinishing(true);
    if (!finishing && subasta.status === 'ACTIVE') {
      notification.info({
        placement: 'bottomRight',
        duration: 0,
        message: `Atención, la subasta ${subasta.title} está por finalizar!`,
      });
    }
  }

  useEffect(() => {
    const newSubastaDate = new Date(subasta.dateString);
    const _secondsDiff = getSecondsDiff(newSubastaDate);
    setSecondsDiff(_secondsDiff);
    const [_seconds, _minutes, _hours, _days] = buildStartTimer(_secondsDiff);
    setSeconds(_seconds);setMinutes(_minutes); setHours(_hours); setDays(_days)
  }, [subasta.dateString]);

  useEffect(() => {
    let interval;
    if (secondsDiff > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);

        if (minutes < 5) {
          setWarning();
        }

        if (seconds === 0) {
          if (minutes === 0) {
            if (hours === 0) {
              if (days === 0) {
                setSeconds(0); setMinutes(0); setHours(0); setDays(0);
                setWarning();
                clearInterval(interval);
              } else {
                setDays(days - 1)
                setHours(23)
                setMinutes(59)
                setSeconds(59);
              }
            } else {
              setHours(hours - 1)
              setMinutes(59)
              setSeconds(59);
            }
          } else {
            setMinutes(minutes - 1)
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      setSeconds(0); setMinutes(0); setHours(0); setDays(0);
      setWarning();
    }

    return () => {
      clearInterval(interval);
    }
  }, [secondsDiff, seconds, minutes, hours, days]);

  useEffect(() => {
    const socket = io(__SOCKETIO_SERVER);

    socket.on('connect', function () {
      socket.on(`raise-${subasta._id}`, function (_amount, email, name) {
        if (email !== usuario.email) {
          notification.info({
            placement: 'bottomRight',
            message: `${name || 'Un usuario '} aumentó el importe a ${_amount}`,
          });
        }
        setGanadorEmail(email);
        setAmount(_amount);
      });
    });
  }, [usuario]);

  const handleRaise = async (e) => {
    e.preventDefault();
    // creditsUsed: Los credits que el usuario aposto, pero que todavia no gano porque no termino la apuesta.
    // localAmount: los credits que el usuario apuesta por cada apuesta.
    // amount: los credits de la subasta.
    // userCredits: Los credits que tiene el usuario en su cuenta.
    if (!usuario) {
      notification.warning({
        placement: 'bottomRight',
        message: 'Debes ingresar para poder subir una apuesta!',
      });
      window.scrollTo(0, 0);
      return;
    }

    if (localAmount <= amount) {
      notification.warning({
        placement: 'bottomRight',
        duration: 15,
        message: 'Debes ingresar un importe mayor!'
      });
      return;
    }

    const userCredits = usuario.credits;
    const creditsSum = creditsUsed + localAmount;

    // if (creditsSum > userCredits) {
    if (creditsSum > userCredits) {
      setisRaIseButtonDisabled(true);
      // const diff = creditsSum - userCredits;
      const diff = localAmount - userCredits;
      notification.warning({
        placement: 'bottomRight',
        message: <>No tienes credits suficientes! Te faltan {diff} <ButtonMercadoPago text="Recargar" amount={diff} /></>,
        onClose: () => setisRaIseButtonDisabled(false),
      });
      return;
    }

    const body = JSON.stringify({
      jwtToken: usuario.jwtToken,
      id: subasta._id,
      email: usuario.email,
      name: usuario.name,
      // amount: localAmount + amount,
      // userAmount: localAmount,
      amount: localAmount,
      // userAmount: localAmount,
    });
    const response = await fetch('/api/subastas/raise', {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const status = await response.status;

    if (status === 200) {
      const data = await response.json();
      setCreditsUsed(data.creditsUsed);
      notification.success({
        placement: 'bottomRight',
        message: 'Has podido aumentar exitosamente!',
      });
    } else {
      notification.error({
        placement: 'bottomRight',
        message: 'Error, no has podido aumentar',
      });
    }
  }

  const handleLocalAmount = (value) => {
    setLocalAmount(value);
  }

  return (
    <Card
      hoverable
      style={{ width: 240 }}
      className={`card-subasta ${finishing ? 'card-subasta--finishing' : ''}`}
      cover={<img alt="parlante" width="240" src={`${__IMAGENES_PUBLIC_PATH}subastas/${subasta.image}`} />}
      title={subasta.title}
    >
      <p>{seconds} Segundos</p>
      <p>{minutes} Minutos</p>
      <p>{hours} Horas</p>
      <p>{days} Días</p>
      <div className="amount">{amount} credits</div>
      <form>
        {
          usuario && usuario.email === ganadorEmail ? (
            <div>Vas ganando!</div>
          ) : (
              <>
                <InputNumber
                  defaultValue={amount + 1}
                  onChange={handleLocalAmount}
                  min={amount}
                />
                <Button disabled={isRaiseButtonDisabled} type="success" onClick={handleRaise}>Subir apuesta</Button>
              </>
            )
        }
      </form>
    </Card>
  )
}

export default Subasta;
