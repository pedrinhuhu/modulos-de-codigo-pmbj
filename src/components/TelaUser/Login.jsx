





export function Login() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Usuario</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Digite seu usuario"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 mb-2">Senha</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="Digite sua senha"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Entrar
                </button>
            </form>
        </div>
    </div>
  );
}