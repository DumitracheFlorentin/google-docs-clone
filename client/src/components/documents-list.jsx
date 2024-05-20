import React from 'react'
import { Link } from 'react-router-dom'

function DocumentsList({ documents, onAddDocument }) {
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
                    className="group block overflow-hidden bg-gray-200 flex justify-center items-center"
                  >
                    <div className="relative py-5">
                      <h3 className="text-md text-gray-700 group-hover:underline group-hover:underline-offset-4">
                        {doc.title || 'Undefined title'}
                      </h3>
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
