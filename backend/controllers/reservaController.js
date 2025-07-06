const Reserva = require('../models/Reserva');
const Propiedad = require('../models/Property');

// Create new reservation
const crearReserva = async (req, res) => {
  try {
    const { propiedad_id, desde, hasta } = req.body;

    const diagnostico = {
      idRecibido: propiedad_id,
      tipoId: typeof propiedad_id,
      longitudId: propiedad_id.length,
      esValidoMongoose: mongoose.Types.ObjectId.isValid(propiedad_id)
    };

    

    console.log('Buscando propiedad con ID:', propiedad_id);
    console.log('Tipo de ID:', typeof propiedad_id);


    const propiedad = await Propiedad.findById(propiedad_id);
    
    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontraa', 
        diagnostico,
        sugerencia: "Verifique el ID o la conexión con la base de datos" });
    }

    const reservasExistentes = await Reserva.find({
      propiedad: propiedad_id,
      estado: 'confirmada',
      $or: [
        {
          desde: { $lte: new Date(hasta) },
          hasta: { $gte: new Date(desde) }
        }
      ]
    });

    if (reservasExistentes.length > 0) {
      return res.status(400).json({ message: 'La propiedad no está disponible para las fechas seleccionadas' });
    }

    // Calculate nights and total price
    const diffTime = Math.abs(new Date(hasta) - new Date(desde));
    const noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const precio_total = noches * propiedad.precio_noche;

    // Create reservation
    const reserva = new Reserva({
      usuario: req.usuario._id,
      propiedad: propiedad_id,
      desde,
      hasta,
      noches,
      precio_total,
      estado: 'confirmada'
    });

    await reserva.save();

    // Update property availability
    propiedad.disponibilidad.push({
      inicio: desde,
      fin: hasta
    });
    await propiedad.save();

    res.status(201).json(reserva);
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ 
      message: 'Error al crear reserva',
      error: error.message 
    });
  }
};

// Get user's reservations
const getMisReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find({ usuario: req.usuario._id })
      .populate('propiedad')
      .sort({ createdAt: -1 });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

// Get property's reservations
const getReservasPropiedad = async (req, res) => {
  try {
    const propiedad = await Propiedad.findById(req.params.id);

    if (!propiedad) {
      return res.status(404).json({ message: 'Propiedad no encontrada' });
    }

    // Check if user is the owner
    if (propiedad.propietario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const reservas = await Reserva.find({ propiedad: req.params.id })
      .populate('usuario', 'nombre email telefono')
      .sort({ createdAt: -1 });

    res.json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
};

// Cancel reservation
const cancelarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Check if user is the owner of the reservation
    if (reserva.usuario.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    // Check if reservation can be cancelled (e.g., not too close to start date)
    const ahora = new Date();
    const fechaInicio = new Date(reserva.desde);
    const diasDiferencia = Math.ceil((fechaInicio - ahora) / (1000 * 60 * 60 * 24));

    if (diasDiferencia < 2) {
      return res.status(400).json({ message: 'No se puede cancelar la reserva con menos de 2 días de anticipación' });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    // Update property availability
    const propiedad = await Propiedad.findById(reserva.propiedad);
    propiedad.disponibilidad = propiedad.disponibilidad.filter(
      disp => !(disp.inicio.getTime() === new Date(reserva.desde).getTime() &&
                disp.fin.getTime() === new Date(reserva.hasta).getTime())
    );
    await propiedad.save();

    res.json({ message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar reserva' });
  }
};

module.exports = {
  crearReserva,
  getMisReservas,
  getReservasPropiedad,
  cancelarReserva
}; 