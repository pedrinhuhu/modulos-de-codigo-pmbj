import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const user = e.target.user.value;
    const password = e.target.password.value;

    if (user === "teste" && password === "123") {
      localStorage.setItem("logado", "true");
      navigate("/pdfs");
    } else {
      alert("Credenciais inválidas!");
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#0a2a43]"
      role="main"
    >
      <form
        onSubmit={handleLogin}
        aria-labelledby="login-title"
        className="bg-white border border-gray-300 rounded-xl shadow-xl p-10 w-full max-w-md flex flex-col gap-5"
      >
        <h1
          id="login-title"
          className="text-3xl font-bold text-center text-[#0a2a43]"
        >
          Acesso ao Sistema
        </h1>

        <div className="flex flex-col gap-1">
          <label htmlFor="user" className="font-medium">
            Usuário
          </label>
          <input
            id="user"
            type="text"
            name="user"
            placeholder="Usuario"
            autoComplete="username"
            aria-required="true"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-medium">
            Senha
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Senha"
            autoComplete="current-password"
            aria-required="true"
            className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        <button
          type="submit"
          aria-label="Entrar no sistema"
          className="mt-4 bg-blue-600 text-white py-3 rounded font-bold tracking-wide hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
