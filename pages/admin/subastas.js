import PageAdmin from '../../components/pages/admin';

export const getServerSideProps = async () => {
  const { dbModels: { getModel } } = require('../../helpers/server');
  const subastas = await getModel('subastas');

  return {
    props: {
      subastasJson: JSON.stringify(subastas),
    }
  }
}

export default function Home({ user, subastasJson }) {
  const subastas = JSON.parse(subastasJson);
  return (
    <PageAdmin page="subastas" user={user} subastas={subastas} />
  )
};
