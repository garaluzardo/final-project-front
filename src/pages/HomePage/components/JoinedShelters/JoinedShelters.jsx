import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../../context/auth.context';
import userService from '../../../../services/user.service';
import Loading from '../../../../components/Loading/Loading';
import './JoinedShelters.css';

const JoinedShelters = () => {
  const [joinedShelters, setJoinedShelters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchJoinedShelters = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await userService.getJoinedShelters(user._id);
        setJoinedShelters(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching joined shelters:", error);
        setError("No se pudieron cargar las protectoras");
        setIsLoading(false);
      }
    };

    fetchJoinedShelters();
  }, [user]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (joinedShelters.length === 0) {
    return (
      <div className="no-shelters">
        <p>Aún no te has unido a ninguna protectora.</p>
        <Link to="/shelters" className="explore-button">
          Explorar protectoras
        </Link>
      </div>
    );
  }

  return (
    <div className="joined-shelters-container">
      <h2>Protectoras donde colaboras</h2>
      <div className="joined-shelters-list">
        {joinedShelters.map(shelter => (
          <Link 
            key={shelter._id} 
            to={`/shelters/${shelter.handle}`} 
            className="joined-shelter-item"
          >
            <div className="shelter-avatar">
              {shelter.imageUrl ? (
                <img src={shelter.imageUrl} alt={shelter.name} />
              ) : (
                <div className="default-shelter-avatar">
                  {shelter.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="shelter-details">
              <div className="shelter-name-container">
                <h3>{shelter.name}</h3>
                {shelter.admins.some(admin => admin._id === user._id) && (
                  <span className="admin-badge">Admin</span>
                )}
              </div>
              <p>@{shelter.handle}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JoinedShelters;