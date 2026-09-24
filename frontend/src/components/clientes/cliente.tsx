import { useEffect, useState, type FormEvent } from 'react'
import '../consulta/consulta.css'

interface Cliente {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
  criadoEm: string
  criadoPorId: number | null
  criadoPor: {
    id: number
    nome: string
    usuario: string
  } | null
}

interface ClientesProps {
  onVoltar: () => void
}

function Clientes({ onVoltar }: ClientesProps) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function carregarClientes() {
    try {
      setErro('')

      const token = localStorage.getItem('token')

      if (!token) {
        setErro('Você precisa estar logado.')
        return
      }

      const resposta = await fetch('https://vet-care-pink-eight.vercel.app/clientes', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
            dados.message ||
            'Não foi possível carregar os clientes.'
        )
        return
      }

      setClientes(dados)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  useEffect(() => {
    carregarClientes()
  }, [])

  function limparFormulario() {
    setNome('')
    setCpf('')
    setEmail('')
    setTelefone('')
    setErro('')
    setSucesso('')
  }

  function abrirFormulario() {
    limparFormulario()
    setMostrarFormulario(true)
  }

  function fecharFormulario() {
    limparFormulario()
    setMostrarFormulario(false)
  }

  async function cadastrarCliente(e: FormEvent) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (
      !nome.trim() ||
      !cpf.trim() ||
      !email.trim() ||
      !telefone.trim()
    ) {
      setErro('Preencha todos os campos.')
      return
    }

    try {
      setCarregando(true)

      const token = localStorage.getItem('token')

      if (!token) {
        setErro('Você precisa estar logado.')
        return
      }

      const resposta = await fetch('https://vet-care-pink-eight.vercel.app/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nome.trim(),
          cpf: cpf.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
            dados.message ||
            'Não foi possível cadastrar o cliente.'
        )
        return
      }

      setSucesso('Cliente cadastrado com sucesso!')

      setNome('')
      setCpf('')
      setEmail('')
      setTelefone('')

      await carregarClientes()

      setTimeout(() => {
        setMostrarFormulario(false)
        setSucesso('')
      }, 1000)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
    }
  }

  async function excluirCliente(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este cliente?'
    )

    if (!confirmar) return

    setErro('')
    setSucesso('')

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        `https://vet-care-pink-eight.vercel.app/clientes/${id}`,
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
          'Não foi possível excluir o cliente.'
        )
        return
      }

      setClientes((listaAtual) =>
        listaAtual.filter((item) => item.id !== id)
      )
      setSucesso('Cliente excluído com sucesso!')
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  return (
    <main className="cadastro-page">
      <div className="cadastro-container">

        {/* CABEÇALHO */}
        <div className="cadastro-header">

          <button
            type="button"
            className="voltar-button"
            onClick={onVoltar}
          >
            ← Voltar
          </button>

          <div>
            <h1>👥 Clientes</h1>
            <p>Gerencie os clientes cadastrados no VetCare.</p>
          </div>

          <button
            type="button"
            className="novo-button"
            onClick={abrirFormulario}
          >
            + Novo Cliente
          </button>

        </div>

        {/* MENSAGENS */}
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

        {/* FORMULÁRIO */}
        {mostrarFormulario && (
          <div className="form-card">

            <h2>Novo Cliente</h2>

            <form onSubmit={cadastrarCliente}>

              <div className="form-grid">

                <div className="campo">
                  <label htmlFor="cliente-nome">
                    Nome completo
                  </label>

                  <input
                    id="cliente-nome"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="cliente-cpf">
                    CPF
                  </label>

                  <input
                    id="cliente-cpf"
                    type="text"
                    placeholder="Digite o CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="cliente-email">
                    E-mail
                  </label>

                  <input
                    id="cliente-email"
                    type="email"
                    placeholder="Digite o e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="campo">
                  <label htmlFor="cliente-telefone">
                    Telefone
                  </label>

                  <input
                    id="cliente-telefone"
                    type="text"
                    placeholder="Digite o telefone"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancelar-button"
                  onClick={fecharFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="salvar-button"
                  disabled={carregando}
                >
                  {carregando
                    ? 'Cadastrando...'
                    : 'Cadastrar Cliente'}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* LISTA */}
        <div className="lista-card">

          <h2>Clientes cadastrados</h2>

          {clientes.length === 0 ? (

            <div className="lista-vazia">

              <div
                style={{
                  fontSize: '42px',
                  marginBottom: '10px',
                }}
              >
                👥
              </div>

              <div>
                Nenhum cliente cadastrado.
              </div>

            </div>

          ) : (

            <div className="tabela cliente-tabela">

              <div className="tabela-header">
                <span>Nome</span>
                <span>CPF</span>
                <span>E-mail</span>
                <span>Telefone</span>
                <span>Criado por</span>
                <span>Ações</span>
              </div>

              {clientes.map((cliente) => (

                <div
                  className="tabela-linha"
                  key={cliente.id}
                >
                  <span>{cliente.nome}</span>
                  <span>{cliente.cpf}</span>
                  <span>{cliente.email}</span>
                  <span>{cliente.telefone}</span>
                  <span>
                    {cliente.criadoPor?.usuario || "Cadastro anterior"}
                  </span>
                  <span>
                    <button
                      className="excluir-button"
                      onClick={() => excluirCliente(cliente.id)}
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

export default Clientes