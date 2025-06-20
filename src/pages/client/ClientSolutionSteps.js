import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Button, Alert
} from 'reactstrap';

const SolutionSteps = () => {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/solutions/${solutionId}/steps`, {
      headers: authHeader()
    }).then(res => {
      setSteps(res.data.data || []);
    }).catch(() => {
      setError('Failed to load steps.');
    });
  }, [solutionId]);

  return (
    <Container className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h2 className="text-primary mt-4 mb-3">Steps for the Solution</h2>

      {error && <Alert color="danger">{error}</Alert>}

      <Card>
        <CardBody>
          <CardTitle tag="h5">Step List</CardTitle>
          {steps.length > 0 ? (
            <ListGroup className="mt-3">
              {steps.map(step => (
                <ListGroupItem key={step.id}>
                  <strong>Step {step.order}</strong><br />
                  <span>{step.description}</span><br />
                  {step.image && (
                    <img
                      src={`http://localhost:8000/storage/${step.image}`}
                      alt="step"
                      className="img-fluid mt-2"
                      style={{ maxWidth: '300px' }}
                    />
                  )}
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted mt-2">No steps found.</p>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default SolutionSteps;
