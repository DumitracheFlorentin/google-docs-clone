import React from 'react'
import { Link } from 'react-router-dom'

function DocumentsList({ documents, onAddDocument }) {
  function formatDate(dateString) {
    const date = new Date(dateString)

    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')

    let hour = date.getUTCHours()
    const ampm = hour >= 12 ? 'PM' : 'AM'
    hour = hour % 12
    hour = hour ? hour : 12
    const formattedHour = String(hour).padStart(2, '0')

    const minute = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    return `${year}/${month}/${day} ${formattedHour}:${minute}:${seconds} ${ampm}`
  }

  return (
    <div>
      <section>
        <div className="mx-auto max-w-screen-xl py-8  sm:py-12">
          <header>
            <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">
              Your Documents
            </h2>
          </header>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {documents &&
              documents.map((doc) => (
                <li key={doc._id}>
                  <Link
                    to={`/documents/${doc._id}`}
                    className="rounded-xl group block overflow-hidden bg-gray-200 flex justify-center items-center"
                  >
                    <div className="relative py-5">
                      <h3 className="text-md text-center text-gray-700 group-hover:underline group-hover:underline-offset-4">
                        {doc.title || 'Undefined title'}
                      </h3>

                      <h5 className="mt-3 text-sm text-center text-gray-400 group-hover:underline group-hover:underline-offset-4">
                        Last Update:
                      </h5>
                      <p className="mt-1 text-sm text-center text-gray-400 group-hover:underline group-hover:underline-offset-4">
                        {formatDate(doc.updated_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      <button
        onClick={onAddDocument}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Add New Document
      </button>
    </div>
  )
}

export default DocumentsList
