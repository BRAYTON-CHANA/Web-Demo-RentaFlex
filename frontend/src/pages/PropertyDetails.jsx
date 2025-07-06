import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [reservation, setReservation] = useState({
    desde: '',
    hasta: '',
    
  });

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await api.get(`/properties/${id}`);
      setProperty(response.data);
    } catch (error) {
      setError('Error al cargar los detalles de la propiedad');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    console.log("Llego hasta aqui");
    try {
      console.log("Empezo recien");
      await api.post('/reservas', {
        propiedad_id: id,
        desde: reservation.desde,
        hasta: reservation.hasta
      });
      console.log("No Llego hasta navigate my reservations");
      navigate('/my-reservations');
      console.log("Llego hasta navigate my reservations");
    } catch (error) {
      setError(error.response?.data?.message || 'Error al realizar la reserva');
    }
    console.log("Se fue de aqui");
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-900">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!property) {
    return <div className="text-center py-8 text-gray-900">Propiedad no encontrada</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Galería de Imágenes */}
      <div className="mb-8">
        <div className="relative h-96 mb-4">
          <img
            src={property.imagenes[selectedImage]}
            alt={property.titulo}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {property.imagenes.map((imagen, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`h-24 rounded-lg overflow-hidden ${
                selectedImage === index ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <img
                src={imagen}
                alt={`${property.titulo} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información de la Propiedad */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">{property.titulo}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-4">{property.direccion}</span>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Detalles</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Habitaciones</p>
                <p className="font-semibold text-gray-900">{property.habitaciones}</p>
              </div>
              <div>
                <p className="text-gray-600">Baños</p>
                <p className="font-semibold text-gray-900">{property.banos}</p>
              </div>
              <div>
                <p className="text-gray-600">Área</p>
                <p className="font-semibold text-gray-900">{property.area_m2} m²</p>
              </div>
              <div>
                <p className="text-gray-600">Tipo</p>
                <p className="font-semibold text-gray-900 capitalize">{property.tipo}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Descripción</h2>
            <p className="text-gray-600">{property.descripcion}</p>
          </div>
        </div>

        {/* Formulario de Reserva */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ${property.precio_noche}
              </span>
              <span className="text-gray-600"> / noche</span>
            </div>

            <form onSubmit={handleReservationSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Llegada
                  </label>
                  <input
                    type="date"
                    name="desde"
                    value={reservation.desde}
                    onChange={(e) =>
                      setReservation({ ...reservation, desde: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 [&::-webkit-calendar-picker-indicator]:text-gray-700 [&::-webkit-calendar-picker-indicator]:hover:text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salida
                  </label>
                  <input
                    type="date"
                    name="hasta"
                    value={reservation.hasta}
                    onChange={(e) =>
                      setReservation({ ...reservation, hasta: e.target.value })
                    }
                    min={reservation.desde || new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 [&::-webkit-calendar-picker-indicator]:text-gray-700 [&::-webkit-calendar-picker-indicator]:hover:text-gray-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isAuthenticated ? 'Reservar' : 'Iniciar sesión para reservar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 