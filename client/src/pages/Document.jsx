import { useCallback, useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import DocumentTitle from '../components/document-title'

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
  const [socket, setSocket] = useState()
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
    const s = io('http://localhost:3001')
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

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
    <>
      <DocumentTitle initialTitle={title} onTitleChange={handleTitleChange} />
      <div className="container" ref={wrapperRef}></div>
    </>
  )
}
