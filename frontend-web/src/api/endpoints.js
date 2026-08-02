import api from './client'

export const authApi = {
  login: (username, password) => api.post('/auth/login', { username, password }),
}

export const pacientesApi = {
  listar: (nome) => api.get('/pacientes', { params: nome ? { nome } : {} }),
  buscar: (id) => api.get(`/pacientes/${id}`),
  criar: (data) => api.post('/pacientes', data),
  atualizar: (id, data) => api.put(`/pacientes/${id}`, data),
  inativar: (id) => api.delete(`/pacientes/${id}`),
}

export const medicosApi = {
  listar: (nome) => api.get('/medicos', { params: nome ? { nome } : {} }),
  buscar: (id) => api.get(`/medicos/${id}`),
  criar: (data) => api.post('/medicos', data),
  atualizar: (id, data) => api.put(`/medicos/${id}`, data),
  inativar: (id) => api.delete(`/medicos/${id}`),
}

export const consultasApi = {
  listar: (params) => api.get('/consultas', { params }),
  buscar: (id) => api.get(`/consultas/${id}`),
  criar: (data) => api.post('/consultas', data),
  atualizar: (id, data) => api.put(`/consultas/${id}`, data),
  cancelar: (id) => api.delete(`/consultas/${id}`),
}

export const prontuariosApi = {
  listarPorPaciente: (pacienteId) => api.get('/prontuarios', { params: { pacienteId } }),
  buscar: (id) => api.get(`/prontuarios/${id}`),
  criar: (data) => api.post('/prontuarios', data),
}

export const dashboardApi = {
  resumo: () => api.get('/dashboard/resumo'),
}
