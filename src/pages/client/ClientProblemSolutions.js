import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem, Button, Alert
} from 'reactstrap';

const ProblemSolutions = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
      console.log("Problem ID:", problemId);
      axios.get(`/api/problems/${problemId}/solutions`, {
        headers: authHeader()
      }).then(res => {
        console.log("Full API Response:", res);
        console.log("Data Field:", res.data);
        setSolutions(res.data || []);
      }).catch((err) => {
        console.error("Error loading solutions", err);
        setError('Failed to load solutions.');
      });
    }, [problemId]);



  return (
    <Container className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h2 className="text-primary mt-4 mb-3">Solutions for the Problem</h2>

      {error && <Alert color="danger">{error}</Alert>}

      <Card>
        <CardBody>
          <CardTitle tag="h5">Solution List</CardTitle>
          {solutions.length > 0 ? (
            <ListGroup className="mt-3">
              {solutions.map(solution => (
                <ListGroupItem
                  key={solution.id}
                  action
                  onClick={() => navigate(`/client/solutions/${solution.id}/steps`)}
                >
                  <strong>{solution.title}</strong><br />
                  <span className="text-muted">{solution.description}</span>
                </ListGroupItem>
              ))}
            </ListGroup>
          ) : (
            <p className="text-muted mt-2">No solutions found.</p>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default ProblemSolutions;
