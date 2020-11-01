import getConfig from 'next/config'
const { publicRuntimeConfig: { __API_URL } } = getConfig();

export default function Sarasa({ user }) {
  return (
  <div>Sarasa {`${__API_URL}`}</div>
  )
}
