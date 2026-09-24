import { useEffect, useState, type FormEvent } from 'react'
import './consulta.css'

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
  petId: number
  veterinarioId: number
  dataConsulta: string
  statusConsulta: string
  pet: Pet
  veterinario: Veterinario
}

interface ConsultasProps {
  onVoltar: () => void
}

function Consultas({ onVoltar }: ConsultasProps) {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([])

  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [petId, setPetId] = useState('')
  const [veterinarioId, setVeterinarioId] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function carregarDados() {
    try {
      const token = localStorage.getItem('token')

      const [resConsultas, resPets, resVeterinarios] =
        await Promise.all([
          fetch('https://vet-care-pink-eight.vercel.app/consultas', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch('https://vet-care-pink-eight.vercel.app/pets', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch('https://vet-care-pink-eight.vercel.app/veterinarios', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

      const dadosConsultas = await resConsultas.json()
      const dadosPets = await resPets.json()
      const dadosVeterinarios = await resVeterinarios.json()

      if (!resConsultas.ok) {
        setErro('Erro ao carregar consultas.')
        return
      }

      setConsultas(dadosConsultas)
      setPets(dadosPets)
      setVeterinarios(dadosVeterinarios)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  async function cadastrarConsulta(e: FormEvent) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (!petId || !veterinarioId || !data || !horario) {
      setErro('Preencha todos os campos.')
      return
    }

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        'https://vet-care-pink-eight.vercel.app/consultas',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            petId: Number(petId),
            veterinarioId: Number(veterinarioId),
            data,
            horario,
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível cadastrar a consulta.'
        )
        return
      }

      setSucesso('Consulta cadastrada com sucesso!')

      setPetId('')
      setVeterinarioId('')
      setData('')
      setHorario('')

      setMostrarFormulario(false)

      await carregarDados()
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  async function alterarStatus(
    id: number,
    status: 'Concluida' | 'Cancelada'
  ) {
    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        `https://vet-care-pink-eight.vercel.app/consultas/${id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível alterar o status.'
        )
        return
      }

      await carregarDados()
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  function formatarData(dataConsulta: string) {
    return new Date(dataConsulta).toLocaleString('pt-BR')
  }

  async function excluirConsulta(id: number) {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir esta consulta?'
    )

    if (!confirmar) return

    setErro('')
    setSucesso('')

    try {
      const token = localStorage.getItem('token')

      const resposta = await fetch(
        `https://vet-care-pink-eight.vercel.app/consultas/${id}`,
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
          'Não foi possível excluir a consulta.'
        )
        return
      }

      setConsultas((listaAtual) =>
        listaAtual.filter((item) => item.id !== id)
      )
      setSucesso('Consulta excluída com sucesso!')
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  async function editarConsulta(c: Consulta) {
    const atual = new Date(c.dataConsulta)
    const petId = window.prompt('ID do pet', String(c.petId)); if (petId === null) return
    const veterinarioId = window.prompt('ID do veterinário', String(c.veterinarioId)); if (veterinarioId === null) return
    const data = window.prompt('Data (AAAA-MM-DD)', atual.toISOString().slice(0,10)); if (data === null) return
    const horario = window.prompt('Horário (HH:MM)', atual.toTimeString().slice(0,5)); if (horario === null) return
    const token=localStorage.getItem('token')
    const resposta=await fetch(`https://vet-care-pink-eight.vercel.app/consultas/${c.id}`,{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({petId:Number(petId),veterinarioId:Number(veterinarioId),data,horario})})
    const dados=await resposta.json();if(!resposta.ok){setErro(dados.erro||dados.message||'Erro ao editar consulta.');return}
    setSucesso('Consulta atualizada com sucesso!');await carregarDados()
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
            <h1>📅 Consultas</h1>
            <p>
              Gerencie as consultas da clínica.
            </p>
          </div>

          <button
            className="novo-button"
            onClick={() => {
              setErro('')
              setMostrarFormulario(true)
            }}
          >
            + Nova Consulta
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

            <h2>Nova Consulta</h2>

            <form onSubmit={cadastrarConsulta}>

              <div className="form-grid">

                <div className="campo">
                  <label>Pet</label>

                  <select
                    value={petId}
                    onChange={(e) =>
                      setPetId(e.target.value)
                    }
                  >
                    <option value="">
                      Selecione o pet
                    </option>

                    {pets.map((pet) => (
                      <option
                        key={pet.id}
                        value={pet.id}
                      >
                        {pet.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Veterinário</label>

                  <select
                    value={veterinarioId}
                    onChange={(e) =>
                      setVeterinarioId(e.target.value)
                    }
                  >
                    <option value="">
                      Selecione o veterinário
                    </option>

                    {veterinarios.map((veterinario) => (
                      <option
                        key={veterinario.id}
                        value={veterinario.id}
                      >
                        {veterinario.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="campo">
                  <label>Data</label>

                  <input
                    type="date"
                    value={data}
                    onChange={(e) =>
                      setData(e.target.value)
                    }
                  />
                </div>

                <div className="campo">
                  <label>Horário</label>

                  <input
                    type="time"
                    value={horario}
                    onChange={(e) =>
                      setHorario(e.target.value)
                    }
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
                  Cadastrar Consulta
                </button>

              </div>

            </form>
          </div>
        )}

        <div className="lista-card">

          <h2>Consultas cadastradas</h2>

          {consultas.length === 0 ? (
            <div className="lista-vazia">
              Nenhuma consulta cadastrada.
            </div>
          ) : (
            <div className="tabela">

              <div className="tabela-header">
                <span>Pet</span>
                <span>Veterinário</span>
                <span>Data</span>
                <span>Status</span>
                <span>Ações</span>
              </div>

              {consultas.map((consulta) => (
                <div
                  className="tabela-linha"
                  key={consulta.id}
                >
                  <span>
                    {consulta.pet?.nome}
                  </span>

                  <span>
                    {consulta.veterinario?.nome}
                  </span>

                  <span>
                    {formatarData(
                      consulta.dataConsulta
                    )}
                  </span>

                  <span>
                    {consulta.statusConsulta}
                  </span>

                  <span className="acoes">

                    {consulta.statusConsulta ===
                      'Agendada' && (
                      <>
                        <button
                          onClick={() =>
                            alterarStatus(
                              consulta.id,
                              'Concluida'
                            )
                          }
                        >
                          Concluir
                        </button>

                        <button
                          onClick={() =>
                            alterarStatus(
                              consulta.id,
                              'Cancelada'
                            )
                          }
                        >
                          Cancelar
                        </button>
                      </>
                    )}

                    <button type="button" onClick={() => editarConsulta(consulta)} style={{ marginRight: '6px' }}>Editar</button>
                    <button
                      className="excluir-button"
                      onClick={() => excluirConsulta(consulta.id)}
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

export default Consultas