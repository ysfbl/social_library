# Social Library

A full-stack social platform for book and movie enthusiasts to discover, rate, review, and share their favorite content with friends.

## Features

- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Social Networking**: Follow friends and see their activity
- **Content Discovery**: Browse and search books and movies
- **Reviews & Ratings**: Rate and review your favorite books and movies
- **Personal Library**: Track your reading and watching history
- **Activity Feed**: See what your friends are reading and watching
- **External APIs**: Integration with TMDb (movies) and Google Books APIs

## Tech Stack

### Backend
- Node.js & TypeScript
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- TMDb API Key ([Get one here](https://www.themoviedb.org/settings/api))
- Google Books API Key ([Get one here](https://console.cloud.google.com/apis/library/books.googleapis.com))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/social_library.git
cd social_library
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_library
DB_USER=postgres
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# External API Keys
TMDB_API_KEY=your_tmdb_api_key_here
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (optional)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASSWORD=your_email_password
# EMAIL_FROM=your_email@gmail.com
```

### 3. Database Setup

Create a PostgreSQL database:

```bash
psql -U postgres
CREATE DATABASE social_library;
\q
```

Run database migrations:

```bash
# From the backend directory
npm run migrate
```

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3000`

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/:id/follow` - Follow a user
- `DELETE /api/users/:id/follow` - Unfollow a user

### Movies
- `GET /api/movies` - Search movies
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies/:id/rate` - Rate a movie
- `POST /api/movies/:id/review` - Review a movie

### Books
- `GET /api/books` - Search books
- `GET /api/books/:id` - Get book details
- `POST /api/books/:id/rate` - Rate a book
- `POST /api/books/:id/review` - Review a book

### Activity Feed
- `GET /api/feed` - Get activity feed from followed users

## Project Structure

```
social_library/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Entry point
│   ├── database/
│   │   └── migrations/      # SQL migration files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.tsx          # Main app component
│   └── package.json
└── README.md
```

## Development

### Backend Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run migrate      # Run database migrations
```

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User accounts and profiles
- **movies** - Movie information from TMDb
- **books** - Book information from Google Books
- **ratings** - User ratings for movies and books
- **reviews** - User reviews for movies and books
- **follows** - User follow relationships
- **user_activity** - Activity feed entries

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for movie data
- [Google Books API](https://developers.google.com/books) for book data

## Contact

Yusuf Bal - yusufbal.b02@gmail.com

Project Link: [https://github.com/yusufbl/social_library]
