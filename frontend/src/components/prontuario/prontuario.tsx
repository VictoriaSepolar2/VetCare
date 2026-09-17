import { useEffect, useState, type FormEvent } from 'react'
import './Prontuario.css'

interface Pet {
  id: number
  nome: string
}

interface Veterinario {
  id: number
  nome: string
}

interface Consulta {
  id: number
  dataConsulta: string
  pet: Pet
  veterinario: Veterinario
}

interface Prontuario {
  id: number
  consultaId: number
  diagnostico: string
  medicamentosPrescritos: string
  dataRetorno: string | null
  consulta: Consulta
}

interface ProntuariosProps {
  onVoltar: () => void
}

function Prontuarios({
  onVoltar,
}: ProntuariosProps) {
  const [prontuarios, setProntuarios] =
    useState<Prontuario[]>([])

  const [consultas, setConsultas] =
    useState<Consulta[]>([])

  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [consultaId, setConsultaId] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [
    medicamentosPrescritos,
    setMedicamentosPrescritos,
  ] = useState('')
  const [dataRetorno, setDataRetorno] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarDados() {
    try {
      const token = localStorage.getItem('token')

      const [resProntuarios, resConsultas] =
        await Promise.all([
          fetch(
            'http://localhost:3333/prontuarios',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          fetch(
            'http://localhost:3333/consultas',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ])

      const dadosProntuarios =
        await resProntuarios.json()

      const dadosConsultas =
        await resConsultas.json()

      if (!resProntuarios.ok) {
        setErro('Erro ao carregar prontuários.')
        return
      }

      setProntuarios(dadosProntuarios)
      setConsultas(dadosConsultas)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function cadastrarProntuario(
    e: FormEvent
  ) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (
      !consultaId ||
      !diagnostico ||
      !medicamentosPrescritos
    ) {
      setErro('Preencha todos os campos obrigatórios.')
      return
    }

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        'http://localhost:3333/prontuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            consultaId: Number(consultaId),
            diagnostico,
            medicamentosPrescritos,
            dataRetorno:
              dataRetorno || undefined,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível cadastrar o prontuário.'
        )
        return
      }

      setSucesso(
        'Prontuário cadastrado com sucesso!'
      )

      setConsultaId('')
      setDiagnostico('')
      setMedicamentosPrescritos('')
      setDataRetorno('')

      setMostrarFormulario(false)

      await carregarDados()
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  async function excluirProntuario(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este prontuário?'
    )

    if (!confirmar) return

    setErro('')
    setSucesso('')

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        `http://localhost:3333/prontuarios/${id}`,
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
          'Não foi possível excluir o prontuário.'
        )
        return
      }

      setProntuarios((listaAtual) =>
        listaAtual.filter((item) => item.id !== id)
      )
      setSucesso('Prontuário excluído com sucesso!')
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
            <h1>📋 Prontuários</h1>
            <p>
              Histórico médico dos pets.
            </p>
          </div>

          <button
            className="novo-button"
            onClick={() => {
              setErro('')
              setMostrarFormulario(true)
            }}
          >
            + Novo Prontuário
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

            <h2>Novo Prontuário</h2>

            <form onSubmit={cadastrarProntuario}>

              <div className="form-grid">

                <div className="campo">
                  <label>Consulta</label>

                  <select
                    value={consultaId}
                    onChange={(e) =>
                      setConsultaId(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Selecione a consulta
                    </option>

                    {consultas.map((consulta) => (
                      <option
                        key={consulta.id}
                        value={consulta.id}
                      >
                        Consulta #{consulta.id} -{' '}
                        {consulta.pet?.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Data de retorno</label>

                  <input
                    type="datetime-local"
                    value={dataRetorno}
                    onChange={(e) =>
                      setDataRetorno(
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="campo campo-grande">
                  <label>Diagnóstico</label>

                  <textarea
                    value={diagnostico}
                    onChange={(e) =>
                      setDiagnostico(
                        e.target.value
                      )
                    }
                    placeholder="Digite o diagnóstico"
                  />
                </div>

                <div className="campo campo-grande">
                  <label>
                    Medicamentos prescritos
                  </label>

                  <textarea
                    value={medicamentosPrescritos}
                    onChange={(e) =>
                      setMedicamentosPrescritos(
                        e.target.value
                      )
                    }
                    placeholder="Digite os medicamentos"
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
                  Cadastrar Prontuário
                </button>

              </div>

            </form>
          </div>
        )}

        <div className="lista-card">

          <h2>Prontuários cadastrados</h2>

          {prontuarios.length === 0 ? (
            <div className="lista-vazia">
              Nenhum prontuário cadastrado.
            </div>
          ) : (
            <div className="prontuarios-grid">

              {prontuarios.map((prontuario) => (
                <div
                  className="prontuario-card"
                  key={prontuario.id}
                >
                  <h3>
                    🐾{' '}
                    {prontuario.consulta?.pet?.nome}
                  </h3>

                  <p>
                    <strong>Veterinário:</strong>{' '}
                    {prontuario.consulta?.veterinario?.nome}
                  </p>

                  <p>
                    <strong>Diagnóstico:</strong>{' '}
                    {prontuario.diagnostico}
                  </p>

                  <p>
                    <strong>Medicamentos:</strong>{' '}
                    {prontuario.medicamentosPrescritos}
                  </p>

                  {prontuario.dataRetorno && (
                    <p>
                      <strong>Retorno:</strong>{' '}
                      {new Date(
                        prontuario.dataRetorno
                      ).toLocaleString('pt-BR')}
                    </p>
                  )}

                  <button
                    className="excluir-button"
                    onClick={() =>
                      excluirProntuario(prontuario.id)
                    }
                  >
                    🗑 Excluir
                  </button>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  )
}

export default Prontuarios