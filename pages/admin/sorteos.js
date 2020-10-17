import PageSorteos from '../../components/pages/admin';

export const getServerSideProps = async () => {
  const { dbModels: { getModel } } = require('../../helpers/server');
  const sorteos = await getModel('sorteos');

  return {
    props: {
      sorteosJson: JSON.stringify(sorteos),
    }
  }
}

export default function Home({ user, sorteosJson }) {
  const sorteos = JSON.parse(sorteosJson);
  return (
    <PageSorteos page="sorteos" user={user} sorteos={sorteos} />
  )
};
