import { useState, type FormEvent } from 'react'
import './App.css'

type Tela = 'login' | 'cadastro' | 'inicio'

function App() {
  const [tela, setTela] = useState<Tela>(() => {
    const token = localStorage.getItem('token')
    return token ? 'inicio' : 'login'
  })

  // Login
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')

  // Cadastro
  const [nome, setNome] = useState('')
  const [novoUsuario, setNovoUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  function limparMensagens() {
    setErro('')
    setSucesso('')
  }

  function irParaCadastro() {
    limparMensagens()
    setTela('cadastro')
  }

  function irParaLogin() {
    limparMensagens()
    setTela('login')
  }

  async function entrar(e: FormEvent) {
    e.preventDefault()

    limparMensagens()

    if (!usuario.trim() || !senha) {
      setErro('Preencha usuário e senha.')
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        'http://localhost:3333/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            usuario: usuario.trim(),
            senha,
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

      localStorage.setItem('token', dados.token)
      localStorage.setItem(
        'usuario',
        JSON.stringify(dados.usuario)
      )

      setTela('inicio')
      setSenha('')
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function cadastrar(e: FormEvent) {
    e.preventDefault()

    limparMensagens()

    if (
      !nome.trim() ||
      !novoUsuario.trim() ||
      !email.trim() ||
      !novaSenha ||
      !confirmarSenha
    ) {
      setErro('Preencha todos os campos.')
      return
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não são iguais.')
      return
    }

    if (novaSenha.length < 6) {
      setErro(
        'A senha deve ter pelo menos 6 caracteres.'
      )
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        'http://localhost:3333/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: nome.trim(),
            usuario: novoUsuario.trim(),
            email: email.trim(),
            senha: novaSenha,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível criar a conta.'
        )
        return
      }

      setSucesso(
        'Conta criada com sucesso! Agora faça seu login.'
      )

      setUsuario(novoUsuario.trim())

      setNome('')
      setNovoUsuario('')
      setEmail('')
      setNovaSenha('')
      setConfirmarSenha('')

      setTela('login')
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
    setSenha('')
    setErro('')
    setSucesso('')
    setTela('login')
  }

  function usuarioLogado() {
    try {
      const dados = localStorage.getItem('usuario')

      if (!dados) {
        return null
      }

      return JSON.parse(dados)
    } catch {
      return null
    }
  }

  if (tela === 'inicio') {
    const usuarioAtual = usuarioLogado()

    return (
      <main className="home-page">
        <div className="home-card">

          <div className="home-logo">
            <span>🐾</span>
            <h1>VetCare</h1>
          </div>

          <h2>
            Bem-vindo ao VetCare!
          </h2>

          <p className="home-text">
            Olá,{' '}
            <strong>
              {usuarioAtual?.nome ||
                usuarioAtual?.usuario ||
                'usuário'}
            </strong>
            !
          </p>

          <p className="home-description">
            Seu acesso foi realizado com sucesso.
          </p>

          <div className="home-actions">
            <button
              type="button"
              className="primary-button"
            >
              🐶 Clientes
            </button>

            <button
              type="button"
              className="primary-button"
            >
              🐾 Pets
            </button>

            <button
              type="button"
              className="primary-button"
            >
              🩺 Veterinários
            </button>

            <button
              type="button"
              className="primary-button"
            >
              📅 Consultas
            </button>

            <button
              type="button"
              className="primary-button"
            >
              📋 Prontuários
            </button>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={sair}
          >
            Sair
          </button>

        </div>
      </main>
    )
  }

  if (tela === 'cadastro') {
    return (
      <main className="login-page">
        <div className="login-card">

          <div className="logo">
            <span>🐾</span>
            <h1>VetCare</h1>
          </div>

          <p className="subtitle">
            Crie sua conta
          </p>

          <form onSubmit={cadastrar}>

            <label htmlFor="nome">
              Nome completo
            </label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
            />

            <label htmlFor="novoUsuario">
              Nome de usuário
            </label>

            <input
              id="novoUsuario"
              type="text"
              placeholder="Escolha um nome de usuário"
              value={novoUsuario}
              onChange={(e) =>
                setNovoUsuario(e.target.value)
              }
            />

            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <label htmlFor="novaSenha">
              Senha
            </label>

            <input
              id="novaSenha"
              type="password"
              placeholder="Digite sua senha"
              value={novaSenha}
              onChange={(e) =>
                setNovaSenha(e.target.value)
              }
            />

            <label htmlFor="confirmarSenha">
              Confirmar senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(e.target.value)
              }
            />

            {erro && (
              <p className="erro">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? 'Criando conta...'
                : 'Criar conta'}
            </button>

          </form>

          <button
            type="button"
            className="link-button"
            onClick={irParaLogin}
          >
            Já tenho uma conta
          </button>

          <p className="footer">
            © 2026 VetCare
          </p>

        </div>
      </main>
    )
  }

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="logo">
          <span>🐾</span>
          <h1>VetCare</h1>
        </div>

        <p className="subtitle">
          Clinica Veterinário
        </p>

        <form onSubmit={entrar}>

          <label htmlFor="usuario">
            Usuário
          </label>

          <input
            id="usuario"
            type="text"
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={(e) =>
              setUsuario(e.target.value)
            }
          />

          <label htmlFor="senha">
            Senha
          </label>

          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
          />

          {erro && (
            <p className="erro">
              {erro}
            </p>
          )}

          {sucesso && (
            <p className="sucesso">
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
          >
            {carregando
              ? 'Entrando...'
              : 'Entrar'}
          </button>

        </form>

        <div className="cadastro-area">
          <p>
            Ainda não possui uma conta?
          </p>

          <button
            type="button"
            className="link-button"
            onClick={irParaCadastro}
          >
            Criar minha conta
          </button>
        </div>

        <p className="footer">
          © 2026 VetCare
        </p>

      </div>
    </main>
  )
}

export default App