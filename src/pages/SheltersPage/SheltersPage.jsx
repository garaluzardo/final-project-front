import SheltersList from "../../components/SheltersList/SheltersList";

function SheltersPage() {
  return (
    <div>
      <h1>Shelters List Page</h1>
      <p>En esta página se verán todas las protectoras creadas.</p>
      <p>
        Corresponde a un listado o índice de todas las protectoras, lo que es un
        estándar en diseño web (mostrar primero un listado y luego permitir
        acceder al detalle)
      </p>
      <p>
        Este componente renderiza todas las protectoras disponibles en formato
        de tarjetas o cuadrícula, mostrando información resumida de cada una.
      </p>
      <p>
        Cada tarjeta clickable redirecciona a la página detallada de esa
        protectora específica usando su handle como identificador en la URL.
      </p>
      <p>Esta estructura crea un flujo de navegación natural. 👍</p>
      <p>
        Todo este texto lo he escrito para testearrrrrrrrrrrrrr, apuntar ideas y
        no olvidarme de cosis como asegurarme de que el componente incluya:
      </p>
      <ul>
        <li>
          Filtros o búsqueda para encontrar protectoras específicas cuando la
          lista crezca
        </li>
        <li>Paginación si hay muchas protectoras</li>
        <li>
          Información relevante en las tarjetas para ayudar al usuario a decidir
          cuál visitar
        </li>
      </ul>
      <SheltersList />
    </div>
  );
}

export default SheltersPage;
