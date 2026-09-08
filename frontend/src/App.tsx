
import { useState, type FormEvent } from 'react'
import './App.css'

function App() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()

    setErro('')

    if (!usuario || !senha) {
      setErro('Preencha usuário e senha.')
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch('http://localhost:3333/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario,
          senha,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
       setErro(dados.erro || 'Usuário ou senha inválidos.')
        return
      }

      localStorage.setItem('token', dados.token)
      localStorage.setItem('usuario', JSON.stringify(dados.usuario))

      alert(`Bem-vindo ao VetCare, ${dados.usuario.usuario}!`)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo">
          <span>🐾</span>
          <h1>VetCare</h1>
        </div>

        <p className="subtitle">
          Sistema de gerenciamento veterinário
        </p>

        <form onSubmit={entrar}>
          <label htmlFor="usuario">Usuário</label>

          <input
            id="usuario"
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>

          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          {erro && (
            <p className="erro">
              {erro}
            </p>
          )}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="footer">
          © 2026 VetCare
        </p>
      </div>
    </main>
  )
}

export default App
