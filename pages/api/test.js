import getConfig from 'next/config';

const { publicRuntimeConfig: { __SOCKETIO_SERVER } } = getConfig();

export default async (req, res) => {

  try {

    // 4) Update in all the fronts
    // const params = {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     jwtToken: req.body.jwtToken,
    //     amount,
    //     email,
    //     name,
    //   }),
    //   headers: { 'Content-Type': 'application/json' },
    // };

    // const { status } = await fetch(`${__SOCKETIO_SERVER}/update-sockets`, params);
    const response = await fetch(`${__SOCKETIO_SERVER}/ping`);
    const data = await response.json();
    console.log('status: ', status);
    console.log('data: ', data);
    res.status(200).send({});
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
