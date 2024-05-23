# Collaborative Document Editor

This React application provides a collaborative document editing platform, leveraging real-time updates and user authentication. It's designed for teams who need to collaborate on documents dynamically.

## Key Features

- **Real-Time Collaboration:** Users can see changes being made to documents in real-time. Changes are broadcasted using a socket connection, allowing multiple users to edit the same document simultaneously.

- **User Authentication:** The application includes a user authentication system where users can either log in or register. Authentication is necessary to access and edit documents.

- **Dynamic Document Editing:** Powered by Quill.js, the rich text editor supports various formatting options, including headers, lists, bold, italics, underline, and more.

- **Document Management:** Users can create new documents and access a list of existing documents. Each document is identifiable by a unique ID.

- **Persistent Document History:** The application tracks and displays a history of all changes made to a document. This includes the action taken, the user who made the change, and a timestamp.

- **Responsive User Interface:** Designed with responsiveness in mind, the application adapates well across different devices and screen sizes, ensuring a consistent user experience.

## Technology Stack

- **React.js:** Used for building the user interface.
- **React Router:** Manages navigation and routing within the application.
- **Axios:** Handles HTTP requests for user authentication and fetching documents.
- **Socket.IO:** Enables real-time, bi-directional communication between web clients and servers.
- **Quill:** Provides the rich text editor used for document editing.
- **Tailwind CSS:** Utilized for styling and building a responsive design.

This platform is suitable for teams looking for a flexible and interactive way to manage and edit documents collaboratively.

# Setup Guide

Follow these instructions to get the application up and running on your local machine.

## Frontend Setup

Ensure you are in the project root directory, then follow these steps to set up the frontend:

1. **Navigate to the Client Directory:**
   ```bash
   cd client
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Frontend Server:**
   ```bash
   npm run dev
   ```

## Backend Setup

After setting up the frontend, move on to configuring the backend:

1. **Navigate to the Server Directory:**
   ```bash
   cd server
   ```
2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Create an Environment File:**
- Create a .env file in the root of the server directory and provide the necessary environment variables:
   ```bash
   PORT=3000
   MONGO_URI=your_mongodb_uri
   CORS_ORIGIN=http://localhost:5173
   SOCKET_PORT=3001
   ```

4. **Start the Backend Server:**
   ```bash
   npm run dev
   ```
