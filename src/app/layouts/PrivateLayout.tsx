import { Link, Outlet } from "react-router-dom";

export function PrivateLayout() {
  return (
    <div>
      <header>
        <h1>Organizacional Front</h1>
        <nav>
          <Link to="/users">Usuarios</Link>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
