import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    const user = e.target.user.value;
    const password = e.target.password.value;

    if (user === "admin@prefeitura.com" && password === "123456") {
      localStorage.setItem("logado", "true");
      navigate("/pdfs");
    } else {
      alert("Credenciais inválidas!");
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col items-center justify-center h-screen gap-4"
    >
      <h1 className="text-3xl font-bold">Login</h1>

      <input
        type="text"
        name="user"
        placeholder="Usuário"
        className="border p-2 rounded"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Senha"
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>
    </form>
  );
}