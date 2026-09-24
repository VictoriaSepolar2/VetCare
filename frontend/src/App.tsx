import { useState, type FormEvent } from 'react'
import './App.css'

import Cliente from './components/clientes/cliente'
import Consulta from './components/consulta/consulta'
import Pet from './components/pet/pet'
import Prontuario from './components/prontuario/prontuario'
import Usuario from './components/usuario/usuario'
import Veterinario from './components/veterinario/veterinario'

type Tela =
  | 'login'
  | 'cadastro'
  | 'inicio'
  | 'clientes'
  | 'pets'
  | 'veterinarios'
  | 'consultas'
  | 'prontuarios'
  | 'usuarios'

function App() {
  const [tela, setTela] = useState<Tela>(
    localStorage.getItem('token')
      ? 'inicio'
      : 'login'
  )

  const [usuario, setUsuario] = useState(
    localStorage.getItem('usuario') || ''
  )

  const [loginUsuario, setLoginUsuario] =
    useState('')

  const [loginSenha, setLoginSenha] =
    useState('')

  const [nome, setNome] = useState('')
  const [cadUsuario, setCadUsuario] = useState('')
  const [cadEmail, setCadEmail] = useState('')
  const [cadSenha, setCadSenha] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] =
    useState(false)

  async function entrar(e: FormEvent) {
    e.preventDefault()

    setErro('')
    setCarregando(true)

    try {
      const resposta = await fetch(
        'https://vet-care-pink-eight.vercel.app/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario: loginUsuario,
            senha: loginSenha,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Usuário ou senha inválidos.'
        )
        return
      }

      localStorage.setItem(
        'token',
        dados.token
      )

      localStorage.setItem(
        'usuario',
        dados.usuario?.nome ||
        dados.usuario?.usuario ||
        loginUsuario
      )

      setUsuario(
        dados.usuario?.nome ||
        dados.usuario?.usuario ||
        loginUsuario
      )

      setTela('inicio')
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function cadastrarUsuario(e: FormEvent) {
    e.preventDefault()

    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      const resposta = await fetch(
        'https://vet-care-pink-eight.vercel.app/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            usuario: cadUsuario,
            email: cadEmail,
            senha: cadSenha,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível cadastrar.'
        )
        return
      }

      setSucesso(
        'Usuário cadastrado com sucesso!'
      )

      setNome('')
      setCadUsuario('')
      setCadEmail('')
      setCadSenha('')

      setTimeout(() => {
        setTela('login')
        setSucesso('')
      }, 1000)
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  function sair() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    setUsuario('')
    setLoginUsuario('')
    setLoginSenha('')
    setTela('login')
  }

  if (tela === 'clientes') {
    return (
      <Cliente
        onVoltar={() => setTela('inicio')}
      />
    )
  }

  if (tela === 'pets') {
    return (
      <Pet
        onVoltar={() => setTela('inicio')}
      />
    )
  }

  if (tela === 'veterinarios') {
    return (
      <Veterinario
        onVoltar={() => setTela('inicio')}
      />
    )
  }

  if (tela === 'consultas') {
    return (
      <Consulta
        onVoltar={() => setTela('inicio')}
      />
    )
  }

  if (tela === 'prontuarios') {
    return (
      <Prontuario
        onVoltar={() => setTela('inicio')}
      />
    )
  }

  if (tela === 'usuarios') {
    return (
      <Usuario
        onVoltar={() => setTela('inicio')}
      />
    )
  }

  if (tela === 'cadastro') {
    return (
      <div className="auth-page">

        <div className="auth-card">

          <h1>🐾 VetCare</h1>

          <h2>Criar conta</h2>

          <p>
            Cadastre um novo usuário.
          </p>

          {erro && (
            <div className="mensagem-erro">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="mensagem-sucesso">
              {sucesso}
            </div>
          )}

          <form onSubmit={cadastrarUsuario}>

            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Usuário"
              value={cadUsuario}
              onChange={(e) =>
                setCadUsuario(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="E-mail"
              value={cadEmail}
              onChange={(e) =>
                setCadEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Senha"
              value={cadSenha}
              onChange={(e) =>
                setCadSenha(e.target.value)
              }
            />

            <button
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? 'Cadastrando...'
                : 'Criar conta'}
            </button>

          </form>

          <button
            type="button"
            className="link-button"
            onClick={() => {
              setErro('')
              setTela('login')
            }}
          >
            ← Voltar para login
          </button>

        </div>

      </div>
    )
  }

  if (tela === 'inicio') {
    return (
      <main className="home-page">

        <div className="home-header">

          <div>
            <h1>🐾 VetCare</h1>

            <p>
              Bem-vindo, {usuario}!
            </p>
          </div>

          <button
            className="logout-button"
            onClick={sair}
          >
            Sair
          </button>

        </div>

        <div className="home-content">

          <h2>Painel principal</h2>

          <p>
            Escolha uma área para continuar.
          </p>

          <div className="menu-grid">

            <button
              className="primary-button"
              onClick={() =>
                setTela('clientes')
              }
            >
              👥 Clientes
            </button>

            <button
              className="primary-button"
              onClick={() =>
                setTela('pets')
              }
            >
              🐾 Pets
            </button>

            <button
              className="primary-button"
              onClick={() =>
                setTela('veterinarios')
              }
            >
              🩺 Veterinários
            </button>

            <button
              className="primary-button"
              onClick={() =>
                setTela('consultas')
              }
            >
              📅 Consultas
            </button>

            <button
              className="primary-button"
              onClick={() =>
                setTela('prontuarios')
              }
            >
              📋 Prontuários
            </button>

            <button
              className="primary-button"
              onClick={() =>
                setTela('usuarios')
              }
            >
              👤 Usuários
            </button>

          </div>

        </div>

      </main>
    )
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>🐾 VetCare</h1>

        <h2>Entrar</h2>

        <p>
          Acesse o sistema da clínica.
        </p>

        {erro && (
          <div className="mensagem-erro">
            {erro}
          </div>
        )}

        <form onSubmit={entrar}>

          <input
            type="text"
            placeholder="Usuário"
            value={loginUsuario}
            onChange={(e) =>
              setLoginUsuario(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Senha"
            value={loginSenha}
            onChange={(e) =>
              setLoginSenha(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Entrar'}
          </button>

        </form>

        <button
          type="button"
          className="link-button"
          onClick={() => {
            setErro('')
            setTela('cadastro')
          }}
        >
          Criar novo usuário
        </button>

      </div>

    </div>
  )
}

export default App