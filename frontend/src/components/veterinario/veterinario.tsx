import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import './Veterinario.css'

interface Veterinario {
  id: number
  nome: string
  crmv: string
  especialidade: string
  email: string
}

interface VeterinariosProps {
  onVoltar: () => void
}

function Veterinarios({
  onVoltar,
}: VeterinariosProps) {
  const [
    veterinarios,
    setVeterinarios,
  ] = useState<Veterinario[]>([])

  const [
    mostrarFormulario,
    setMostrarFormulario,
  ] = useState(false)

  const [nome, setNome] = useState('')
  const [crmv, setCrmv] = useState('')
  const [
    especialidade,
    setEspecialidade,
  ] = useState('')
  const [email, setEmail] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] =
    useState('')

  const [
    carregando,
    setCarregando,
  ] = useState(false)

  async function carregarVeterinarios() {
    setErro('')

    try {
      const token =
        localStorage.getItem('token')

      const resposta = await fetch(
        'http://localhost:3333/veterinarios',
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Erro ao carregar veterinários.'
        )

        return
      }

      setVeterinarios(dados)
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.'
      )
    }
  }

  useEffect(() => {
    carregarVeterinarios()
  }, [])

  async function cadastrarVeterinario(
    e: FormEvent
  ) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (
      !nome ||
      !crmv ||
      !especialidade ||
      !email
    ) {
      setErro(
        'Preencha todos os campos.'
      )
      return
    }

    try {
      setCarregando(true)

      const token =
        localStorage.getItem('token')

      const resposta = await fetch(
        'http://localhost:3333/veterinarios',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            crmv,
            especialidade,
            email,
          }),
        }
      )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível cadastrar o veterinário.'
        )

        return
      }

      setSucesso(
        'Veterinário cadastrado com sucesso!'
      )

      setNome('')
      setCrmv('')
      setEspecialidade('')
      setEmail('')

      setMostrarFormulario(false)

      await carregarVeterinarios()
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.'
      )
    } finally {
      setCarregando(false)
    }
  }

  async function excluirVeterinario(
    id: number
  ) {
    const confirmar =
      window.confirm(
        'Tem certeza que deseja excluir este veterinário?'
      )

    if (!confirmar) {
      return
    }

    setErro('')
    setSucesso('')

    try {
      const token =
        localStorage.getItem('token')

      const resposta = await fetch(
        `http://localhost:3333/veterinarios/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const dados =
        await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível excluir o veterinário.'
        )

        return
      }

      setVeterinarios(
        (listaAtual) =>
          listaAtual.filter(
            (veterinario) =>
              veterinario.id !== id
          )
      )

      setSucesso(
        'Veterinário excluído com sucesso!'
      )
    } catch {
      setErro(
        'Não foi possível conectar ao servidor.'
      )
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
            <h1>
              🩺 Veterinários
            </h1>

            <p>
              Gerencie os veterinários
              da clínica.
            </p>
          </div>

          <button
            className="novo-button"
            onClick={() => {
              setErro('')
              setSucesso('')
              setMostrarFormulario(true)
            }}
          >
            + Novo Veterinário
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

            <h2>
              Novo Veterinário
            </h2>

            <form
              onSubmit={
                cadastrarVeterinario
              }
            >

              <div className="form-grid">

                <div className="campo">
                  <label>
                    Nome
                  </label>

                  <input
                    value={nome}
                    onChange={(e) =>
                      setNome(
                        e.target.value
                      )
                    }
                    placeholder="Nome completo"
                  />
                </div>

                <div className="campo">
                  <label>
                    CRMV
                  </label>

                  <input
                    value={crmv}
                    onChange={(e) =>
                      setCrmv(
                        e.target.value
                      )
                    }
                    placeholder="Número do CRMV"
                  />
                </div>

                <div className="campo">
                  <label>
                    Especialidade
                  </label>

                  <input
                    value={
                      especialidade
                    }
                    onChange={(e) =>
                      setEspecialidade(
                        e.target.value
                      )
                    }
                    placeholder="Ex.: Clínica geral"
                  />
                </div>

                <div className="campo">
                  <label>
                    E-mail
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="E-mail"
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancelar-button"
                  onClick={() =>
                    setMostrarFormulario(
                      false
                    )
                  }
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
                    : 'Cadastrar Veterinário'}
                </button>

              </div>

            </form>

          </div>
        )}

        <div className="lista-card">

          <h2>
            Veterinários cadastrados
          </h2>

          {veterinarios.length === 0 ? (
            <div className="lista-vazia">
              Nenhum veterinário
              cadastrado.
            </div>
          ) : (

            <div className="tabela">

              <div className="tabela-header">
                <span>Nome</span>
                <span>CRMV</span>
                <span>
                  Especialidade
                </span>
                <span>E-mail</span>
                <span>Ações</span>
              </div>

              {veterinarios.map(
                (veterinario) => (

                  <div
                    className="tabela-linha"
                    key={
                      veterinario.id
                    }
                  >

                    <span>
                      {veterinario.nome}
                    </span>

                    <span>
                      {veterinario.crmv}
                    </span>

                    <span>
                      {
                        veterinario.especialidade
                      }
                    </span>

                    <span>
                      {veterinario.email}
                    </span>

                    <span>
                      <button
                        className="excluir-button"
                        onClick={() =>
                          excluirVeterinario(
                            veterinario.id
                          )
                        }
                      >
                        🗑 Excluir
                      </button>
                    </span>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </main>
  )
}

export default Veterinarios