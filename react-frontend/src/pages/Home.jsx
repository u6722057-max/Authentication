import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Home() {
  const { user, logout } = useContext(UserContext);
  return (
    <main className="page">
      <div className="section-header">
        <div><p className="eyebrow">Good Day</p><h1>Home</h1></div>
        <button type="button" onClick={logout}>Sign out</button>
      </div>
      <p className="muted">Signed in as {user?.username || user?.email}.</p>
    </main>
  );
}
