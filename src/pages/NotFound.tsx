// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center">
              <div className="text-white text-2xl font-bold">B</div>
            </div>
          </div>
          <h1 className="mt-6 text-center text-6xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-center text-3xl font-bold text-gray-700">
            Página no encontrada
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>
        
        <div>
          <Link to="/" className="btn btn-primary w-full">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;