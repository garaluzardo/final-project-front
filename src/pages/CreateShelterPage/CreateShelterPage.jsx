import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import shelterService from '../../services/shelter.service';

function CreateShelterPage() {
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    bio: '',
    location: '',
    imageUrl: '',
    contact: {
      email: '',
      phone: '',
      website: ''
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: ''
    }
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Manejar campos anidados (contact y socialMedia)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.handle.trim()) {
      newErrors.handle = 'El handle es obligatorio';
    } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.handle)) {
      newErrors.handle = 'El handle solo puede contener letras, números, puntos y guiones bajos';
    }
    
    if (!formData.bio.trim()) {
      newErrors.bio = 'La descripción es obligatoria';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }
    
    if (formData.contact.email && !isValidEmail(formData.contact.email)) {
      newErrors['contact.email'] = 'Email inválido';
    }
    
    if (formData.contact.website && !isValidURL(formData.contact.website)) {
      newErrors['contact.website'] = 'URL inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Usar el servicio para crear la protectora
      const response = await shelterService.createShelter(formData);
      
      // Redirigir a la página de la protectora creada
      navigate(`/shelters/${response.data.handle}`);
    } catch (error) {
      console.error("Error al crear la protectora:", error);
      
      // Manejar errores de la API
      if (error.response?.data?.message) {
        if (error.response.data.message.includes('handle')) {
          setErrors({ ...errors, handle: error.response.data.message });
        } else {
          setErrors({ ...errors, general: error.response.data.message });
        }
      } else {
        setErrors({ ...errors, general: "Error al crear la protectora. Inténtalo de nuevo." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Crear una nueva protectora</h1>
      
      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Información básica</h2>
          
          <div>
            <label className="block text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre de la protectora"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Handle * <span className="text-gray-500 text-sm">(identificador único para la URL)</span></label>
            <div className="flex items-center">
              <span className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-md px-3 py-2">@</span>
              <input
                type="text"
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                className={`flex-1 px-3 py-2 border rounded-r-md ${errors.handle ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="mi_protectora"
              />
            </div>
            {errors.handle && <p className="text-red-500 text-sm mt-1">{errors.handle}</p>}
            <p className="text-gray-500 text-xs mt-1">Solo letras, números, puntos y guiones bajos. No se podrá cambiar después.</p>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Descripción *</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className={`w-full px-3 py-2 border rounded-md ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Describe tu protectora, su misión y objetivos..."
            ></textarea>
            {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Ubicación *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ciudad, Provincia"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">URL de imagen</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-gray-500 text-xs mt-1">URL de una imagen para mostrar como logo o foto de la protectora</p>
          </div>
        </div>
        
        {/* Información de contacto */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Información de contacto</h2>
          
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="contact.email"
              value={formData.contact.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors['contact.email'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="contacto@protectora.com"
            />
            {errors['contact.email'] && <p className="text-red-500 text-sm mt-1">{errors['contact.email']}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              name="contact.phone"
              value={formData.contact.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="123456789"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Sitio web</label>
            <input
              type="text"
              name="contact.website"
              value={formData.contact.website}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors['contact.website'] ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="https://www.tuprotectora.com"
            />
            {errors['contact.website'] && <p className="text-red-500 text-sm mt-1">{errors['contact.website']}</p>}
          </div>
        </div>
        
        {/* Redes sociales */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Redes sociales</h2>
          
          <div>
            <label className="block text-gray-700 mb-1">Facebook</label>
            <input
              type="text"
              name="socialMedia.facebook"
              value={formData.socialMedia.facebook}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://facebook.com/tuprotectora"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Instagram</label>
            <input
              type="text"
              name="socialMedia.instagram"
              value={formData.socialMedia.instagram}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://instagram.com/tuprotectora"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Twitter</label>
            <input
              type="text"
              name="socialMedia.twitter"
              value={formData.socialMedia.twitter}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="https://twitter.com/tuprotectora"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Creando...' : 'Crear protectora'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateShelterPage;