import { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

import { Link, useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import { useSocket } from '../contexts/SocketContext'
import DocumentTitle from '../components/document-title'
import HistoryDisplay from '../components/history-display'

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'blockquote', 'code-block'],
  ['clean'],
]

export default function TextEditor() {
  const navigate = useNavigate()
  const { id: documentId } = useParams()
  const { user } = useUser()
  const socket = useSocket()
  const [quill, setQuill] = useState()
  const [title, setTitle] = useState()

  useEffect(() => {
    if (!user) {
      let queryParams = new URLSearchParams(window.location.search)
      queryParams.set('redirect', documentId)
      navigate(`/?${queryParams.toString()}`, { replace: true })
    }
  }, [user, navigate, documentId])

  useEffect(() => {
    if (socket == null || quill == null || !user) return

    socket.once('load-document', (document) => {
      quill.setContents(document.data)
      quill.enable()
      setTitle(document.title)
    })

    socket.emit('get-document', documentId, user.id)
  }, [socket, quill, documentId])

  useEffect(() => {
    if (socket == null || quill == null) return

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)

    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on('receive-changes', handler)

    return () => {
      socket.off('receive-changes', handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return
      socket.emit('send-changes', delta)
    }
    quill.on('text-change', handler)

    return () => {
      quill.off('text-change', handler)
    }
  }, [socket, quill])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return

    wrapper.innerHTML = ''
    const editor = document.createElement('div')
    wrapper.append(editor)
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    })
    q.disable()
    q.setText('Loading...')
    setQuill(q)
  }, [])

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle)
    socket.emit('update-title', { documentId, title: newTitle })
  }

  return (
    <div className="container mx-auto">
      <div className="mt-5 mb-10 flex items-center justify-between">
        <Link to="/">
          <button className="bg-blue-500 text-white px-5 py-2.5 rounded-xl">
            Home
          </button>
        </Link>

        <DocumentTitle initialTitle={title} onTitleChange={handleTitleChange} />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="h-32 rounded-lg bg-gray-200">
          <h3 className="p-3 text-xl mb-2">History</h3>

          <HistoryDisplay />
        </div>
        <div className="h-32 rounded-lg lg:col-span-2">
          <div>
            <div className="container" ref={wrapperRef}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
