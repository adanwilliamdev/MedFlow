import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Não foi possível entrar. Verifique usuário e senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-visual">
        <div className="login-visual-brand">
          <Icon name="heart" size={20} strokeWidth={2.2} />
          MedFlow
        </div>

        <svg className="login-pulse" viewBox="0 0 500 80" preserveAspectRatio="none" aria-hidden="true">
          <path
            d="M0 40 L110 40 L135 10 L160 68 L185 40 L210 40 L230 22 L250 40 L500 40"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2>Cuidado clínico organizado do início ao fim.</h2>
        <p>
          Pacientes, agenda, prontuário e financeiro em um só lugar, para sua
          clínica passar menos tempo com planilhas e mais tempo com pacientes.
        </p>

        <div className="login-stats">
          <div>
            <strong>+40%</strong>
            <span>agilidade no atendimento</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>prontuário digital</span>
          </div>
          <div>
            <strong>1 painel</strong>
            <span>para toda a clínica</span>
          </div>
        </div>
      </div>
      <div className="login-form-side">
        <div className="login-box">
          <h1>Entrar no MedFlow</h1>
          <p className="sub">Acesse com sua conta de usuário da clínica.</p>

          {error && <div className="alert alert-error"><Icon name="alertTriangle" size={16} />{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="hint-box">
            <Icon name="info" size={16} />
            <span>Credenciais padrão: <strong>admin</strong> / <strong>admin123</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
