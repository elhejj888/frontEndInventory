'use client';
import { useSession } from "next-auth/react";

function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  if (!session) {
    return <p>Non connecté</p>;
  }
  return (
    <div>
      <h1>Bienvenue, </h1>
      <p>Email : {session.user.email}</p>
      <p>Email : {session.user.roles}</p>
    <p>Prénom : {session.user.firstName}</p>
    <p>Nom : {session.user.lastName}</p>

      <p>Token : {session.accessToken}</p>
    </div>
  );
}

export default Profile;