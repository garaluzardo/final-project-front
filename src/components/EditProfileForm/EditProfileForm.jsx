import React, { useState, useRef } from "react";
import userService from "../../services/user.service";
import "./EditProfileForm.css";

const EditProfileForm = ({ profile, onClose, onUpdate }) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    name: profile?.name || "",
    handle: profile?.handle || "",
    bio: profile?.bio || "",
    profilePicture: profile?.profilePicture || "",
    location: {
      city: profile?.location?.city || "",
      municipality: profile?.location?.municipality || "",
      province: profile?.location?.province || "",
      island: profile?.location?.island || "",
      postalCode: profile?.location?.postalCode || ""
    }
  });
  
  // Estado para mostrar una imagen de vista previa
  const [previewImage, setPreviewImage] = useState(profile?.profilePicture || "");
  // Estado para el archivo de imagen seleccionado
  const [selectedFile, setSelectedFile] = useState(null);
  // Estado para mensajes de error
  const [error, setError] = useState("");
  // Estado para mostrar que está guardando
  const [isSaving, setIsSaving] = useState(false);
  
  // Referencia al input de archivo oculto
  const fileInputRef = useRef(null);
  
  // Manejar cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("location.")) {
      // Si el campo es parte de location
      const locationField = name.split(".")[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
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
      let imageUrl = formData.profilePicture;
      
      // Si se seleccionó un nuevo archivo, subirlo
      if (selectedFile) {
        // Método de subida de imagen (cuando esté implementado Cloudinary)
        const uploadResponse = await userService.uploadProfileImage(selectedFile);
        imageUrl = uploadResponse.data.secure_url;
      }
      
      // Actualizar el perfil con la nueva URL de imagen
      const updatedProfile = {
        ...formData,
        profilePicture: imageUrl
      };
      
      // Enviar datos actualizados al backend usando el servicio de usuario
      const response = await userService.updateProfile(profile._id, updatedProfile);
      
      // Avisar al componente padre que se ha actualizado el perfil
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setError(error.response?.data?.message || "Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-modal">
        <div className="edit-profile-header">
          <button 
            className="close-form-button" 
            onClick={onClose}
            aria-label="Cancelar"
          >
            ✕
          </button>
          <h2>Editar perfil</h2>
          <button 
            className="save-button" 
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
        </div>
        
        <div className="edit-profile-content">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Sección de imagen de perfil */}
            <div className="profile-image-edit">
              <div 
                className="profile-avatar-edit"
                onClick={handleImageClick}
              >
                {previewImage ? (
                  <img src={previewImage} alt="Vista previa" />
                ) : (
                  <div className="default-avatar-edit">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 
                     formData.handle ? formData.handle.charAt(0).toUpperCase() : "U"}
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
            
            {/* Campos de texto */}
            <div className="form-fields">
              {/* Nombre */}
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Añade tu nombre"
                  maxLength="50"
                />
                <div className="character-count">{formData.name.length}/50</div>
              </div>
              
              {/* Handle (username) */}
              <div className="form-group">
                <label htmlFor="handle">Handle</label>
                <div className="handle-input">
                  <span className="handle-prefix">@</span>
                  <input
                    type="text"
                    id="handle"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    placeholder="handle"
                    maxLength="15"
                  />
                </div>
                <div className="character-count">{formData.handle.length}/15</div>
              </div>
              
              {/* Biografía */}
              <div className="form-group">
                <label htmlFor="bio">Biografía</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre ti"
                  maxLength="300"
                  rows="4"
                ></textarea>
                <div className="character-count">{formData.bio.length}/300</div>
              </div>
              
              {/* Ubicación */}
              <div className="location-section">
                <h3>Ubicación</h3>
                
                <div className="form-group">
                  <label htmlFor="city">Ciudad</label>
                  <input
                    type="text"
                    id="city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    placeholder="Tu ciudad"
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
                    placeholder="Tu municipio"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="province">Provincia</label>
                  <input
                    type="text"
                    id="province"
                    name="location.province"
                    value={formData.location.province}
                    onChange={handleChange}
                    placeholder="Tu provincia"
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
                    placeholder="Tu isla (si aplica)"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="postalCode">Código Postal</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="location.postalCode"
                    value={formData.location.postalCode}
                    onChange={handleChange}
                    placeholder="Tu código postal"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;