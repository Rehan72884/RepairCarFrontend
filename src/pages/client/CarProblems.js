import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Button, Alert
} from 'reactstrap';

const CarProblems = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`/api/cars/${id}/problems`, {
      headers: authHeader()
    }).then(res => {
         console.log(res.data.data);
      setProblems(res.data.data || []);
    }).catch(() => {
      setError('Failed to load problems.');
    });
  }, [id]);

  return (
    <Container className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h2 className="text-primary mt-4 mb-3">Problems for the Car </h2>

      {error && <Alert color="danger">{error}</Alert>}

      <Card>
        <CardBody>
          <CardTitle tag="h5">Problem List</CardTitle>
          {problems.length > 0 ? (
            <ListGroup className="mt-3">
                {problems.map(problem => (
                <ListGroupItem
                key={problem.id}
                action
                onClick={() => navigate(`/client/problems/${problem.id}/solutions`)}
                >
                <strong>{problem.title}</strong><br />
                <span className="text-muted">{problem.description}</span>
                </ListGroupItem>
                ))}
            </ListGroup>
            ) : (
            <p className="text-muted mt-2">No problems found for this car.</p>
            )}

        </CardBody>
      </Card>
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default CarProblems;
