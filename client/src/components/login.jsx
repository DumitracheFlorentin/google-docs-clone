import React, { useState } from 'react'
import axios from 'axios'

function LoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill in all fields.')
      return
    }

    try {
      let response
      if (isLogin) {
        response = await axios.post('http://localhost:3000/api/users/login', {
          email,
          password,
        })
      } else {
        response = await axios.post(
          'http://localhost:3000/api/users/register',
          { email, password },
        )
      }
      onLogin(response.data)
      onClose()
    } catch (error) {
      console.error(
        'Error:',
        error.response ? error.response.data.message : error.message,
      )
      alert(
        'Failed: ' +
          (error.response ? error.response.data.message : 'No response'),
      )
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            onClick={handleSubmit}
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
          <button
            className="w-full bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600"
            onClick={toggleMode}
          >
            {isLogin ? 'Go to Register' : 'Go to Login'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
