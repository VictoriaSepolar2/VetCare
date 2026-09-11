import { useEffect, useState, type FormEvent } from 'react'
import './Pet.css'

interface Cliente {
  id: number
  nome: string
}

interface Pet {
  id: number
  nome: string
  especie: string
  raca: string
  dataNascimento: string
  clienteId: number
  cliente: Cliente
}

interface PetsProps {
  onVoltar: () => void
}

function Pets({ onVoltar }: PetsProps) {
  const [pets, setPets] = useState<Pet[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState('')
  const [raca, setRaca] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  const [clienteId, setClienteId] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const token = localStorage.getItem('token')

  async function carregarDados() {
    try {
      if (!token) {
        setErro('Você precisa estar logado.')
        return
      }

      const [resPets, resClientes] = await Promise.all([
        fetch('http://localhost:3333/pets', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('http://localhost:3333/clientes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ])

      const dadosPets = await resPets.json()
      const dadosClientes = await resClientes.json()

      if (!resPets.ok) {
        setErro(
          dadosPets.erro ||
          dadosPets.message ||
          'Erro ao carregar pets.'
        )
        return
      }

      if (!resClientes.ok) {
        setErro(
          dadosClientes.erro ||
          dadosClientes.message ||
          'Erro ao carregar clientes.'
        )
        return
      }

      setPets(dadosPets)
      setClientes(dadosClientes)
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    }
  }

  useEffect(() => {
    carregarDados()
  }, [])

  function limparFormulario() {
    setNome('')
    setEspecie('')
    setRaca('')
    setDataNascimento('')
    setClienteId('')
    setErro('')
  }

  async function cadastrarPet(e: FormEvent) {
    e.preventDefault()

    setErro('')
    setSucesso('')

    if (
      !nome ||
      !especie ||
      !raca ||
      !dataNascimento ||
      !clienteId
    ) {
      setErro('Preencha todos os campos.')
      return
    }

    try {
      setCarregando(true)

      const resposta = await fetch(
        'http://localhost:3333/pets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            nome,
            especie,
            raca,
            dataNascimento,
            clienteId: Number(clienteId),
          }),
        }
      )

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(
          dados.erro ||
          dados.message ||
          'Não foi possível cadastrar o pet.'
        )
        return
      }

      setSucesso('Pet cadastrado com sucesso!')
      limparFormulario()
      setMostrarFormulario(false)

      await carregarDados()
    } catch {
      setErro('Não foi possível conectar ao servidor.')
    } finally {
      setCarregando(false)
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
            <h1>🐾 Pets</h1>
            <p>Gerencie os pets cadastrados.</p>
          </div>

          <button
            className="novo-button"
            onClick={() => {
              limparFormulario()
              setMostrarFormulario(true)
            }}
          >
            + Novo Pet
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
            <h2>Novo Pet</h2>

            <form onSubmit={cadastrarPet}>

              <div className="form-grid">

                <div className="campo">
                  <label>Nome</label>
                  <input
                    value={nome}
                    onChange={(e) =>
                      setNome(e.target.value)
                    }
                    placeholder="Nome do pet"
                  />
                </div>

                <div className="campo">
                  <label>Espécie</label>
                  <input
                    value={especie}
                    onChange={(e) =>
                      setEspecie(e.target.value)
                    }
                    placeholder="Cachorro, gato..."
                  />
                </div>

                <div className="campo">
                  <label>Raça</label>
                  <input
                    value={raca}
                    onChange={(e) =>
                      setRaca(e.target.value)
                    }
                    placeholder="Raça"
                  />
                </div>

                <div className="campo">
                  <label>Data de nascimento</label>
                  <input
                    type="date"
                    value={dataNascimento}
                    onChange={(e) =>
                      setDataNascimento(e.target.value)
                    }
                  />
                </div>

                <div className="campo">
                  <label>Cliente</label>

                  <select
                    value={clienteId}
                    onChange={(e) =>
                      setClienteId(e.target.value)
                    }
                  >
                    <option value="">
                      Selecione o cliente
                    </option>

                    {clientes.map((cliente) => (
                      <option
                        key={cliente.id}
                        value={cliente.id}
                      >
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
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
                  disabled={carregando}
                >
                  {carregando
                    ? 'Cadastrando...'
                    : 'Cadastrar Pet'}
                </button>

              </div>

            </form>
          </div>
        )}

        <div className="lista-card">

          <h2>Pets cadastrados</h2>

          {pets.length === 0 ? (
            <div className="lista-vazia">
              Nenhum pet cadastrado.
            </div>
          ) : (
            <div className="tabela">

              <div className="tabela-header">
                <span>Pet</span>
                <span>Espécie</span>
                <span>Raça</span>
                <span>Cliente</span>
              </div>

              {pets.map((pet) => (
                <div
                  className="tabela-linha"
                  key={pet.id}
                >
                  <span>{pet.nome}</span>
                  <span>{pet.especie}</span>
                  <span>{pet.raca}</span>
                  <span>{pet.cliente?.nome}</span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </main>
  )
}

export default Pets