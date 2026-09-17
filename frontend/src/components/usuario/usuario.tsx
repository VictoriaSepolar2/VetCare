import { useEffect, useState, type FormEvent } from 'react'
import './Usuario.css'

interface Usuario {
  id: number
  nome: string
  usuario: string
  email: string
  criadoEm: string
}

interface UsuariosProps {
  onVoltar: () => void
}

function Usuarios({ onVoltar }: UsuariosProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [nome, setNome] = useState('')
  const [usuario, setUsuario] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarUsuarios() {
    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        'http://localhost:3333/usuarios',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Erro ao carregar usuários.'
        )
        return
      }

      setUsuarios(dados)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  async function cadastrarUsuario(e: FormEvent) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (!nome || !usuario || !email || !senha) {
      setErro('Preencha todos os campos.')
      return
    }

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        'http://localhost:3333/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            usuario,
            email,
            senha,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível cadastrar o usuário.'
        )
        return
      }

      setSucesso('Usuário cadastrado com sucesso!')

      setNome('')
      setUsuario('')
      setEmail('')
      setSenha('')

      setMostrarFormulario(false)

      await carregarUsuarios()
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  async function excluirUsuario(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este usuário?'
    )

    if (!confirmar) {
      return
    }

    setErro('')
    setSucesso('')

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        `http://localhost:3333/usuarios/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível excluir o usuário.'
        )
        return
      }

      setSucesso('Usuário excluído com sucesso!')

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter(
          (item) => item.id !== id
        )
      )
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  return (
    <main className="cadastro-page">
      <div className="cadastro-container">

        <div className="cadastro-header">

          <button
            className="voltar-button"
            onClick={onVoltar}
          >
            ← Voltar
          </button>

          <div>
            <h1>👤 Usuários</h1>
            <p>
              Gerencie os usuários do VetCare.
            </p>
          </div>

          <button
            className="novo-button"
            onClick={() => {
              setErro('')
              setMostrarFormulario(true)
            }}
          >
            + Novo Usuário
          </button>

        </div>

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

        {mostrarFormulario && (
          <div className="form-card">

            <h2>Novo Usuário</h2>

            <form onSubmit={cadastrarUsuario}>

              <div className="form-grid">

                <div className="campo">
                  <label>Nome</label>
                  <input
                    value={nome}
                    onChange={(e) =>
                      setNome(e.target.value)
                    }
                    placeholder="Nome completo"
                  />
                </div>

                <div className="campo">
                  <label>Usuário</label>
                  <input
                    value={usuario}
                    onChange={(e) =>
                      setUsuario(e.target.value)
                    }
                    placeholder="Nome de usuário"
                  />
                </div>

                <div className="campo">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="E-mail"
                  />
                </div>

                <div className="campo">
                  <label>Senha</label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) =>
                      setSenha(e.target.value)
                    }
                    placeholder="Senha"
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancelar-button"
                  onClick={() =>
                    setMostrarFormulario(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="salvar-button"
                >
                  Cadastrar Usuário
                </button>

              </div>

            </form>
          </div>
        )}

        <div className="lista-card">

          <h2>Usuários cadastrados</h2>

          {usuarios.length === 0 ? (
            <div className="lista-vazia">
              Nenhum usuário cadastrado.
            </div>
          ) : (
            <div className="tabela">

              <div className="tabela-header">
                <span>Nome</span>
                <span>Usuário</span>
                <span>E-mail</span>
                <span>Criado em</span>
                <span>Ações</span>
              </div>

              {usuarios.map((item) => (
                <div
                  className="tabela-linha"
                  key={item.id}
                >
                  <span>{item.nome}</span>
                  <span>{item.usuario}</span>
                  <span>{item.email}</span>
                  <span>
                    {new Date(
                      item.criadoEm
                    ).toLocaleDateString('pt-BR')}
                  </span>

                  <span>
                    <button
                      className="excluir-button"
                      onClick={() =>
                        excluirUsuario(item.id)
                      }
                    >
                      Excluir
                    </button>
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  )
}

export default Usuarios