import React, { useState, useEffect } from 'react'

const DocumentTitle = ({ initialTitle, onTitleChange }) => {
  const [title, setTitle] = useState(initialTitle)

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  const handleChange = (event) => {
    setTitle(event.target.value)
    if (onTitleChange) {
      onTitleChange(event.target.value)
    }
  }

  return (
    <input
      type="text"
      value={title}
      onChange={handleChange}
      placeholder="Set Document Title"
      className="px-2 py-1 border rounded"
    />
  )
}

export default DocumentTitle
