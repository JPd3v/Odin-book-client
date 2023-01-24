import { Navigate, useParams } from 'react-router-dom';

export default function IndividualPost() {
  const params = useParams();

  if (!params.id) {
    return <Navigate to="/" />;
  }

  return (
    <main>
      <div>individual post placeholder</div>
      <div>{params.id}</div>
    </main>
  );
}
