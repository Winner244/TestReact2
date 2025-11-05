import { createSlice } from '@reduxjs/toolkit'

type AuthState = { loggedIn: boolean }

const initialState: AuthState = { loggedIn: !!localStorage.getItem('mock_logged_in') }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state) {
      state.loggedIn = true
      localStorage.setItem('mock_logged_in', '1')
    },
    logout(state) {
      state.loggedIn = false
      localStorage.removeItem('mock_logged_in')
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer