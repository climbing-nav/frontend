import api from './api'

export const gymService = {
  async getAllGyms() {
    const response = await api.get('/gyms')
    return response.data
  },

  async getGymById(id) {
    const response = await api.get(`/gyms/${id}`)
    return response.data
  },

  async getGymsByLocation(lat, lng, radius = 5) {
    const response = await api.get('/gyms/nearby', {
      params: { lat, lng, radius }
    })
    return response.data
  },

  async getGymCongestion(gymId) {
    const response = await api.get(`/gyms/${gymId}/congestion`)
    return response.data
  },

  async updateGymCongestion(gymId, congestionLevel) {
    const response = await api.post(`/gyms/${gymId}/congestion`, {
      level: congestionLevel
    })
    return response.data
  }
}