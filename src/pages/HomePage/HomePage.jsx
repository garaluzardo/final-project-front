import "./HomePage.css";
import WorkingOnIt from "../../assets/images/work.gif";

function HomePage() {
  return (
    <div className="home-container">
      
      <img src={WorkingOnIt} className="workingonit" alt="working on it gif" />
    </div>
  );
}

export default HomePage;
