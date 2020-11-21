import PageAdmin from '../../components/pages/admin';

export const getServerSideProps = async () => {
  const { dbModels: { getModel } } = require('../../helpers/server');
  const usuarios = await getModel('users');

  return {
    props: {
      usuariosJson: JSON.stringify(usuarios),
    }
  }
}

export default function Home({ user, usuariosJson }) {
  const usuarios = JSON.parse(usuariosJson);
  return (
    <PageAdmin page="usuarios" user={user} usuarios={usuarios} />
  )
};
