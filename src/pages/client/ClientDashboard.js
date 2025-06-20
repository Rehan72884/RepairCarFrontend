import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import {
  Container, Row, Col, Card, CardBody, CardTitle, Button, Alert, ListGroup, ListGroupItem
} from 'reactstrap';

const ClientDashboard = () => {
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [problems, setProblems] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
    fetchMyCars();
  }, []);

  const fetchCars = () => {
    setLoading(true);
    axios.get('/api/cars/list', { headers: authHeader() })
      .then(res => {
        setCars(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load cars.');
        setLoading(false);
      });
  };

  const fetchMyCars = () => {
    axios.get('/api/client-cars/list', { headers: authHeader() })
      .then(res => {
        setMyCars(res.data.data || []);
      })
      .catch(() => {
        setError('Failed to load your cars.');
      });
  };

  const handleAddToMyCars = (carId) => {
    axios.post('/api/client-cars/store', { car_id: carId }, { headers: authHeader() })
      .then(() => {
        setSuccess('Car added to your list!');
        fetchMyCars();
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(() => {
        setError('Failed to add car.');
        setTimeout(() => setError(''), 3000);
      });
  };

  const handleRemove = (carId) => {
    axios.delete(`/api/client-cars/delete/${carId}`, { headers: authHeader() })
      .then(() => {
        setSuccess('Car removed successfully.');
        setMyCars(prev => prev.filter(car => car.id !== carId));
        setTimeout(() => setSuccess(''), 3000);
      })
      .catch(() => {
        setError('Failed to remove the car.');
        setTimeout(() => setError(''), 3000);
      });
  };

  const fetchProblems = (carId) => {
    if (problems[carId]) return; // already fetched
    axios.get(`/api/cars/${carId}/problems`, { headers: authHeader() })
      .then(res => {
        setProblems(prev => ({ ...prev, [carId]: res.data.data || [] }));
      })
      .catch(() => {
        setError('Failed to load problems.');
      });
  };

  return (
    <Container className="py-4">
      <h2 className="text-primary mb-4">Available Cars</h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Row>
        {cars.map(car => (
          <Col md="4" key={car.id} className="mb-4">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">{car.company} - {car.model}</CardTitle>
                <p><strong>Year:</strong> {car.year}</p>
                <Button color="success" onClick={() => handleAddToMyCars(car.id)}>
                  Add to My Cars
                </Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <hr className="my-5" />

      <h2 className="text-primary mb-4">My Cars</h2>

      <Row>
        {myCars.map(car => (
          <Col md="6" key={car.id} className="mb-4">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">{car.company} - {car.model}</CardTitle>
                <p><strong>Year:</strong> {car.year}</p>

                <Button color="danger" size="sm" onClick={() => handleRemove(car.id)} className="me-2">
                  Remove
                </Button>

                <Button color="info" size="sm" onClick={() => navigate(`/client/car/${car.id}/problems`)}>
                  View Problems
                </Button>


                {problems[car.id] && problems[car.id].length > 0 && (
                  <ListGroup className="mt-3">
                    <ListGroupItem active>Problems</ListGroupItem>
                    {problems[car.id].map(problem => (
                      <ListGroupItem key={problem.id}>{problem.name}</ListGroupItem>
                    ))}
                  </ListGroup>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default ClientDashboard;
