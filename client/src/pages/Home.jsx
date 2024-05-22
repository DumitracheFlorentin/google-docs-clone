import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import LoginModal from '../components/login'
import DocumentsList from '../components/documents-list'

import { useUser } from '../contexts/UserContext'

function Home() {
  const navigate = useNavigate()
  const location = useLocation()

  const [modalVisible, setModalVisible] = useState(true)
  const [documents, setDocuments] = useState([])
  const { user, login } = useUser()

  const handleLogin = (userData) => {
    login(userData)
    setModalVisible(false)

    const params = new URLSearchParams(location.search)
    const redirect = params.get('redirect')

    if (redirect) {
      navigate(`/documents/${redirect}`, { replace: true })
    } else {
      navigate('/')
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/documents/${user.id}`,
      )
      setDocuments(response.data)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
  }

  const handleAddDocument = () => {
    navigate(`/documents/${uuidv4()}`)
  }

  useEffect(() => {
    if (user) {
      setModalVisible(false)
      fetchDocuments()
    }
  }, [user])

  return (
    <div className="container mx-auto p-4">
      {!user && modalVisible && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setModalVisible(false)}
        />
      )}

      {user && (
        <DocumentsList
          documents={documents}
          onAddDocument={handleAddDocument}
        />
      )}
    </div>
  )
}

export default Home
