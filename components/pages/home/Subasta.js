import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card, InputNumber, notification, Button } from 'antd';
import getConfig from 'next/config';

import { Context } from '../../context';

import ButtonMercadoPago from '../../commons/ButtonMercadoPago';

const { publicRuntimeConfig: { __SOCKETIO_SERVER } } = getConfig();

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

const Subasta = ({ subasta }) => {
  const { usuario } = useContext(Context);

  const subastaDate = new Date(subasta.dateString);
  const secondsDiff = subastaDate.getTime() / 1000 - Date.now() / 1000;
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

  useEffect(() => {
    let interval;
    if (secondsDiff > 0) {
      interval = setInterval(() => {
        setSeconds(seconds - 1);

        if (seconds === 0) {
          if (minutes === 0) {
            if (hours === 0) {
              if (days === 0) {
                setSeconds(0); setMinutes(0); setHours(0); setDays(0);
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
    }

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

    return () => {
      clearInterval(interval);
    }
  }, []);

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

    if (localAmount === 0) {
      notification.warning({
        placement: 'bottomRight',
        duration: 15,
        message: 'Debes ingresar un importe mayor!'
      });
      return;
    }

    const userCredits = usuario.credits;
    const creditsSum = creditsUsed + localAmount;

    console.log(`creditsUsed: ${creditsUsed} localAmount${localAmount}`)
    console.log(usuario.credits);
    console.log(creditsSum)

    if (creditsSum > userCredits) {
      setisRaIseButtonDisabled(true);
      const diff = creditsSum - userCredits;
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
      amount: localAmount + amount,
      userAmount: localAmount,
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
      className="card-subasta"
      cover={<img alt="parlante" width="240" src="https://d26lpennugtm8s.cloudfront.net/stores/105/049/products/parlante-portatil-panacom-2500w-sp30601-f7468dded3d4e9a75415126339587614-1024-1024.jpg" />}
      title={subasta.title}
    >
      <p>{seconds} Segundos</p>
      <p>{minutes} Minutos</p>
      <p>{hours} Horas</p>
      <p>{days} Días</p>
      <div className="amount">{amount} credits</div>
      <form>
        {
          ganadorEmail === usuario.email ? (
            <div>Vas ganando!</div>
          ) : (
              <>
                <InputNumber
                  defaultValue={1}
                  onChange={handleLocalAmount}
                  min={1}
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


// import React from 'react';
// import io from 'socket.io-client';
// import { connect } from 'react-redux';
// import { Card, InputNumber, notification, Button } from 'antd';
// import getConfig from 'next/config'

// import ButtonMercadoPago from '../../commons/ButtonMercadoPago';

// const { publicRuntimeConfig: { __SOCKETIO_SERVER } } = getConfig();

// class Subasta extends React.PureComponent {
//   state = {
//     amount: this.props.amount,
//     localAmount: 1,
//     notification: '',
//     creditsUsed: (this.props.userData && this.props.userData.creditsUsed) ? this.props.userData.creditsUsed : 0,
//     isRaiseButtonDisabled: false,
//   }

//   async componentDidMount() {
//     const subastaDate = new Date(this.props.dateString)
//     const secondsDiff = subastaDate.getTime()/1000 - Date.now()/1000;

//     if (secondsDiff > 0 ){

//     const daysDecimal = secondsDiff / 60 / 60 / 24;
//     const days = Math.trunc(daysDecimal);

//     const hoursDecimal = (daysDecimal - days) * 24;
//     const hours = Math.trunc(hoursDecimal);

//     const minutesDecimal = (hoursDecimal - hours) * 60;
//     const minutes = Math.trunc(minutesDecimal);

//     const secondsDecimal = (minutesDecimal - minutes) * 60;
//     const seconds = Math.trunc(secondsDecimal);

//     this.setState({ seconds, minutes, hours, days })
//       const interval = setInterval(() => {
//         this.setState({ seconds: this.state.seconds - 1 })
//         let { seconds, hours, minutes, days } = this.state;

//         if(seconds === 0){
//           if(minutes === 0){
//             if(hours === 0){
//               if(days === 0){
//                 this.setState({ seconds: 0, minutes: 0, hours: 0, days: 0 })
//                 clearInterval(interval);
//               }else{
//                 this.setState({ days: days - 1 })
//                 this.setState({ hours: 23 })
//                 this.setState({ minutes: 59 });
//                 this.setState({ seconds: 59 });
//               }
//             }else{
//               this.setState({ hours: hours - 1 });
//               this.setState({ minutes: 59 });
//               this.setState({ seconds: 59 });
//             }
//           }else{
//             this.setState({ minutes: minutes - 1 });
//             this.setState({ seconds: 59 });
//           }
//         }
//       }, 1000);

//       this.setState({ interval });
//     } else {
//       this.setState({ seconds: 0, minutes: 0, hours: 0, days: 0 })
//     }

//     const _this = this;

//     const socket = io(__SOCKETIO_SERVER);

//     socket.on('connect', function () {
//       socket.on('updateSubastas', function (subastas) {
//         _this.setState({ subastas });
//       });
//       socket.on(`raise-${_this.props.id}`, function (amount, email, name) {
//         if (email !== _this.props.userData.email) {
//           notification.info({
//             placement: 'bottomRight',
//             message: `${name || 'Un usuario '} aumentó el importe a ${amount}`,
//           });
//         }
//         _this.setState({ amount })
//       });
//     });
//   }

//   componentWillUnmount () {
//     clearInterval(this.state.interval);
//   }

//   handleRaise = async (e) => {
//     e.preventDefault();
//     // creditsUsed: Los credits que el usuario aposto, pero que todavia no gano porque no termino la apuesta.
//     // localAmount: los credits que el usuario apuesta por cada apuesta.
//     // amount: los credits de la subasta.
//     // userCredits: Los credits que tiene el usuario en su cuenta.
//     const { creditsUsed, localAmount, amount } = this.state;
//     if (!this.props.isSignedIn) {
//       notification.warning({
//         placement: 'bottomRight',
//         message: 'Debes ingresar para poder subir una apuesta!',
//       });
//       window.scrollTo(0, 0);
//       return;
//     }

//     if (localAmount === 0) {
//       notification.warning({
//         placement: 'bottomRight',
//         duration: 15,
//         message: 'Debes ingresar un importe mayor!'
//       });
//       return;
//     }

//     const userCredits = this.props.userData.credits;
//     const creditsSum = creditsUsed + localAmount;

//     if (creditsSum > userCredits) {
//       this.setState({ isRaiseButtonDisabled: true });
//       const diff = creditsSum - userCredits;
//       notification.warning({
//         placement: 'bottomRight',
//         message: <>No tienes credits suficientes! Te faltan {diff} <ButtonMercadoPago text="Recargar" amount={diff} /></>,
//         onClose: () => this.setState({ isRaiseButtonDisabled: false }),
//       });
//       return;
//     }

//     const body = JSON.stringify({
//       jwtToken: this.props.jwtToken,
//       id: this.props.id,
//       email: this.props.userData.email,
//       name: this.props.userData.name,
//       amount: localAmount + amount,
//       userAmount: localAmount,
//     });
//     const response = await fetch('/api/subastas/raise', {
//       method: 'POST',
//       body,
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });
//     const status = await response.status;

//     if (status === 200) {
//       const data = await response.json();
//       this.setState({ creditsUsed: data.creditsUsed });
//       console.log(data);
//       notification.success({
//         placement: 'bottomRight',
//         message: 'Has podido aumentar exitosamente!',
//       });
//     } else {
//       notification.error({
//         placement: 'bottomRight',
//         message: 'Error, no has podido aumentar',
//       });
//     }
//   }

//   handleLocalAmount = (value) => {
//     this.setState({ localAmount: value });
//   }

//   render() {
//     const { seconds, minutes, hours, days } = this.state;
//     return (
//       <Card
//         hoverable
//         style={{ width: 240 }}
//         className="card-subasta"
//         cover={<img alt="parlante" width="240" src="https://d26lpennugtm8s.cloudfront.net/stores/105/049/products/parlante-portatil-panacom-2500w-sp30601-f7468dded3d4e9a75415126339587614-1024-1024.jpg" />}
//       >
//         <p>{seconds} Segundos</p>
//         <p>{minutes} Minutos</p>
//         <p>{hours} Horas</p>
//         <p>{days} Días</p>
//         <div className="amount">{this.state.amount}</div>
//         <form>
//           <InputNumber
//             defaultValue={1}
//             onChange={this.handleLocalAmount}
//             min={1}
//           />
//           <label>{this.state.notification}</label>
//           <Button disabled={this.state.isRaiseButtonDisabled} type="success" onClick={this.handleRaise}>Subir apuesta</Button>
//         </form>
//       </Card>
//     )
//   }
// }

// export default Subasta;
