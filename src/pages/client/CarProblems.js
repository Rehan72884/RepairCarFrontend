import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem,
  Button, Alert, Collapse, Form, FormGroup, Input, Label
} from 'reactstrap';

const CarProblems = () => {
  const { id } = useParams(); // car_id
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({ title: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get(`/api/cars/${id}/problems`, {
      headers: authHeader()
    }).then(res => {
      setProblems(res.data.data || []);
    }).catch(() => {
      setError('Failed to load problems.');
    });
  }, [id]);

  const handleRequestProblem = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/api/users/client-problems/request', {
        car_id: id,
        title: form.title,
        description: form.description
      }, {
        headers: authHeader()
      });

      setSuccessMessage('Problem request sent to admin!');
      setForm({ title: '', description: '' });
      setFormVisible(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to submit problem request.');
    }
  };

  return (
    <Container className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h2 className="text-primary mt-4 mb-3">Problems for the Car</h2>

      {successMessage && <Alert color="success">{successMessage}</Alert>}
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
        <Button
        color="primary"
        className="mb-3"
        onClick={() => setFormVisible(!formVisible)}
      >
        {formVisible ? 'Cancel' : 'Request New Problem'}
      </Button>

       <Collapse isOpen={formVisible}>
        <Card className="mb-3">
          <CardBody>
            <Form onSubmit={handleRequestProblem}>
              <FormGroup>
                <Label for="title">Problem Title</Label>
                <Input
                  type="text"
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="description">Problem Description</Label>
                <Input
                  type="textarea"
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </FormGroup>

              <Button color="success" type="submit">Send Request</Button>
            </Form>
          </CardBody>
        </Card>
      </Collapse>
      </Card>
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default CarProblems;