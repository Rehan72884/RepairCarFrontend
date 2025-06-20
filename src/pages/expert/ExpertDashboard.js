import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Card, CardBody, CardTitle, Button, Row, Col } from 'reactstrap';

const ExpertDashboard = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/api/cars/list', { headers: authHeader() })
      .then((res) => setCars(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedCar) {
      axios
        .get(`/api/cars/${selectedCar}/problems`, { headers: authHeader() })
        .then((res) => setProblems(res.data.data))
        .catch((err) => console.error(err));
    }
  }, [selectedCar]);

  return (
    <div style={styles.mainContainer}>
      <h1 style={styles.title}>Expert Dashboard</h1>

      <Row className="mb-4">
        {cars.map((car) => (
          <Col md="4" sm="6" xs="12" key={car.id} className="mb-3">
            <Card
              className={`shadow text-center ${
                selectedCar === car.id ? 'border-primary' : ''
              }`}
            >
              <CardBody>
                <CardTitle tag="h5">
                  {car.company} - {car.model}
                </CardTitle>
                <p className="text-muted">{car.year}</p>
                <Button
                  color={selectedCar === car.id ? 'primary' : 'secondary'}
                  onClick={() => setSelectedCar(car.id)}
                >
                  {selectedCar === car.id ? 'Selected' : 'Select'}
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {selectedCar && (
        <div>
          <h2 style={styles.subtitle}>Problems List</h2>
          <div style={styles.problemListContainer}>
            {problems.length === 0 ? (
              <p style={styles.noDataText}>No problems found for this car.</p>
            ) : (
              problems.map((problem) => (
                <div
                  key={problem.id}
                  style={{
                    ...styles.problemCard,
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/expert/problems/${problem.id}/solutions`)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = 'scale(1.02)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = 'scale(1)')
                  }
                >
                  <div style={styles.problemText}>
                    <strong>{problem.title}</strong>
                    <p>{problem.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// 🔵 Custom Styles
const styles = {
  mainContainer: {
    backgroundColor: '#f4f5f7',
    minHeight: '100vh',
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '30px',
  },
  subtitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '30px 0 20px 0',
    color: '#333',
    textAlign: 'center',
  },
  problemListContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    paddingLeft: '70px',
    paddingRight: '70px',
  },
  problemCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  problemText: {
    fontSize: '16px',
    color: '#555',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
};

export default ExpertDashboard;
