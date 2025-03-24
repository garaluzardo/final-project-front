import React, { useState, useRef } from "react";
import shelterService from "../../../../services/shelter.service";
import "./EditShelterForm.css";

const EditShelterForm = ({ shelter, onClose, onUpdate, onDelete, isDeleting }) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    name: shelter?.name || "",
    handle: shelter?.handle || "",
    bio: shelter?.bio || "",
    imageUrl: shelter?.imageUrl || "",
    location: {
      fullAddress: shelter?.location?.fullAddress || "",
      city: shelter?.location?.city || "",
      municipality: shelter?.location?.municipality || "",
      province: shelter?.location?.province || "",
      island: shelter?.location?.island || "",
      postalCode: shelter?.location?.postalCode || ""
    },
    contact: {
      email: shelter?.contact?.email || "",
      phone: shelter?.contact?.phone || "",
      website: shelter?.contact?.website || ""
    },
    socialMedia: {
      facebook: shelter?.socialMedia?.facebook || "",
      instagram: shelter?.socialMedia?.instagram || "",
      twitter: shelter?.socialMedia?.twitter || ""
    }
  });
  
  // Estado para mostrar una imagen de vista previa
  const [previewImage, setPreviewImage] = useState(shelter?.imageUrl || "");
  // Estado para el archivo de imagen seleccionado
  const [selectedFile, setSelectedFile] = useState(null);
  // Estado para mensajes de error
  const [error, setError] = useState("");
  // Estado para mostrar que está guardando
  const [isSaving, setIsSaving] = useState(false);
  // Estado para confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Referencia al input de archivo oculto
  const fileInputRef = useRef(null);
  
  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Si el campo es parte de un objeto anidado (location, contact, socialMedia)
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      // Para campos normales
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Abrir el selector de archivos cuando se hace clic en la imagen de perfil
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  // Manejar la selección de un archivo de imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Por favor, selecciona una imagen válida (JPEG, PNG, GIF o WEBP)");
      return;
    }
    
    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. El tamaño máximo es 5MB");
      return;
    }
    
    setError("");
    setSelectedFile(file);
    
    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Si se seleccionó un nuevo archivo, subirlo
      if (selectedFile) {
        // Método de subida de imagen (cuando esté implementado Cloudinary)
        try {
          const uploadResponse = await shelterService.uploadShelterImage(selectedFile);
          imageUrl = uploadResponse.data.secure_url;
        } catch (uploadError) {
          console.error("Error al subir imagen:", uploadError);
          // Continuar con la imagen actual si hay un error en la subida
        }
      }
      
      // Actualizar el perfil con la nueva URL de imagen
      const updatedShelter = {
        ...formData,
        imageUrl: imageUrl
      };
      
      // Enviar datos actualizados al backend usando el servicio
      const response = await shelterService.updateShelter(shelter._id, updatedShelter);
      
      // Avisar al componente padre que se ha actualizado el perfil
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error actualizando protectora:", error);
      setError(error.response?.data?.message || "Error al actualizar la protectora");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-shelter-overlay">
      <div className="edit-shelter-modal">
        <div className="edit-shelter-header">
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Cancelar"
          >
            ✕
          </button>
          <h2>Editar protectora</h2>
          <button 
            className="save-button" 
            onClick={handleSubmit}
            disabled={isSaving || isDeleting}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
        
        <div className="edit-shelter-content">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Sección de imagen */}
            <div className="shelter-image-edit">
              <div 
                className="shelter-avatar-edit"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Vista previa" />
                ) : (
                  <div className="default-avatar-edit">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 
                     formData.handle ? formData.handle.charAt(0).toUpperCase() : "P"}
                  </div>
                )}
                <div className="upload-icon">+</div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }}
              />
            </div>
            
            {/* Campos de texto básicos */}
            <div className="form-fields">
              <h3>Información básica</h3>
              
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nombre de la protectora"
                  maxLength="100"
                  required
                />
              </div>
              
              {/* Handle (username) */}
              <div className="form-group">
                <label htmlFor="handle">Handle*</label>
                <div className="handle-input">
                  <span className="handle-prefix">@</span>
                  <input
                    type="text"
                    id="handle"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="handle"
                    maxLength="30"
                    required
                  />
                </div>
                <div className="help-text">Solo letras, números, puntos y guiones bajos.</div>
              </div>
              
              {/* Biografía */}
              <div className="form-group">
                <label htmlFor="bio">Descripción*</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Describe tu protectora"
                  maxLength="500"
                  rows="4"
                  required
                ></textarea>
                <div className="character-count">{formData.bio.length}/500</div>
              </div>
              
              {/* Información de ubicación */}
              <h3>Ubicación</h3>
              
              <div className="form-group">
                <label htmlFor="fullAddress">Dirección completa</label>
                <input
                  type="text"
                  id="fullAddress"
                  name="location.fullAddress"
                  value={formData.location.fullAddress}
                  onChange={handleChange}
                  placeholder="Dirección completa"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    placeholder="Ciudad"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="municipality">Municipio</label>
                  <input
                    type="text"
                    id="municipality"
                    name="location.municipality"
                    value={formData.location.municipality}
                    onChange={handleChange}
                    placeholder="Municipio"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="province">Provincia</label>
                  <input
                    type="text"
                    id="province"
                    name="location.province"
                    value={formData.location.province}
                    onChange={handleChange}
                    placeholder="Provincia"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="island">Isla</label>
                  <input
                    type="text"
                    id="island"
                    name="location.island"
                    value={formData.location.island}
                    onChange={handleChange}
                    placeholder="Isla (si aplica)"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode">Código Postal</label>
                <input
                  type="text"
                  id="postalCode"
                  name="location.postalCode"
                  value={formData.location.postalCode}
                  onChange={handleChange}
                  placeholder="Código postal"
                />
              </div>
              
              {/* Información de contacto */}
              <h3>Contacto</h3>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleChange}
                  placeholder="Email de contacto"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleChange}
                  placeholder="Teléfono de contacto"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="website">Sitio web</label>
                <input
                  type="url"
                  id="website"
                  name="contact.website"
                  value={formData.contact.website}
                  onChange={handleChange}
                  placeholder="https://tuprotectora.com"
                />
              </div>
              
              {/* Redes sociales */}
              <h3>Redes sociales</h3>
              
              <div className="form-group">
                <label htmlFor="facebook">Facebook</label>
                <input
                  type="url"
                  id="facebook"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleChange}
                  placeholder="https://facebook.com/tuprotectora"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="instagram">Instagram</label>
                <input
                  type="url"
                  id="instagram"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/tuprotectora"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/tuprotectora"
                />
              </div>
              
              {/* Sección para eliminar protectora */}
              <div className="delete-shelter-section">
            {/*     <h3>Zona de peligro</h3> */}
                <p className="warning-text">
                  La eliminación de una protectora es irreversible. Se eliminarán todas las tareas, animales y
                  referencias asociadas a esta protectora.
                </p>
                
                {!showDeleteConfirm ? (
                  <button 
                    type="button" 
                    className="delete-shelter-button"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Eliminar protectora
                  </button>
                ) : (
                  <div className="delete-confirmation">
                    <p>¿Estás completamente seguro? Esta acción no se puede deshacer.</p>
                    <div className="delete-actions">
                      <button 
                        type="button" 
                        className="cancel-delete-button"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        className="confirm-delete-button"
                        onClick={onDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Eliminando..." : "Sí, eliminar protectora"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditShelterForm;