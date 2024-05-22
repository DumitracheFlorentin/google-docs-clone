// HistoryDisplay.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../contexts/SocketContext'

const HistoryDisplay = () => {
  const { id: documentId } = useParams()
  const [history, setHistory] = useState([])
  const socket = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.emit('subscribe-history', documentId)

    socket.on('load-history', (loadedHistory) => {
      setHistory(loadedHistory.reverse()) // Reverse the loaded history once
    })

    socket.on('history-update', (newEntry) => {
      setHistory((prevHistory) => [newEntry, ...prevHistory]) // Add new entries to the top
    })

    return () => {
      socket.off('load-history')
      socket.off('history-update')
    }
  }, [socket, documentId])

  return (
    <div className="h-[35rem] overflow-y-scroll p-4 bg-gray-100">
      <h3 className="text-xl font-semibold mb-4">Document Change History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index} className="mb-2 p-2 bg-white shadow rounded-lg">
            <strong>{new Date(entry.timestamp).toLocaleString()}:</strong>
            <span className="text-blue-600"> {entry.action}</span> by User{' '}
            {entry.userEmail}
            <div className="text-sm text-gray-600">Change: {entry.change}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HistoryDisplay
