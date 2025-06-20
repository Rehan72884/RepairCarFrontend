import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Alert
} from 'reactstrap';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const ProblemSolutions = () => {
  const { problemId } = useParams();
  const [solutions, setSolutions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/problems/${problemId}/solutions`, {
      headers: authHeader()
    })
      .then(res => setSolutions(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to fetch solutions.');
      });
  }, [problemId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    axios.post('/api/solutions/store', {
      ...form,
      problem_id: problemId
    }, {
      headers: authHeader()
    }).then(res => {
      setSolutions(prev => [...prev, res.data.data]);
      setForm({ title: '', description: '' });
      setSuccess('Solution added successfully!');
    }).catch(err => {
      console.error(err);
      setError('Failed to add solution.');
    });
  };

  const startEditing = (solution) => {
    setEditingId(solution.id);
    setEditForm({ title: solution.title, description: solution.description });
    setError('');
    setSuccess('');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: '', description: '' });
  };

  const saveEdit = (id) => {
    setError('');
    setSuccess('');
    axios.post(`/api/solutions/update/${id}`, editForm, {
      headers: authHeader()
    }).then(res => {
      if (res.data && res.data.data) {
        setSolutions(prev =>
          prev.map(sol => (sol.id === id ? res.data.data : sol))
        );
      } else {
        setSolutions(prev =>
          prev.map(sol => (sol.id === id ? { ...sol, ...editForm } : sol))
        );
      }

      setEditingId(null);
      setEditForm({ title: '', description: '' });
      setSuccess('Solution updated successfully!');
    }).catch(err => {
      console.error(err);
      setError('Failed to update solution.');
    });
  };

  const deleteSolution = (id) => {
    if (!window.confirm('Are you sure you want to delete this solution?')) return;

    setError('');
    setSuccess('');
    axios.delete(`/api/solutions/delete/${id}`, {
      headers: authHeader()
    }).then(() => {
      setSolutions(prev => prev.filter(sol => sol.id !== id));
      setSuccess('Solution deleted successfully!');
    }).catch(err => {
      console.error(err);
      setError('Failed to delete solution.');
    });
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4 text-primary">Solutions for Problem #{problemId}</h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Card className="mb-5 shadow">
        <CardBody>
          <CardTitle tag="h4" className="mb-4">Add New Solution</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter solution title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                id="description"
                type="textarea"
                placeholder="Describe the solution"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </FormGroup>
            <Button color="primary" type="submit">Submit</Button>
          </Form>
        </CardBody>
      </Card>

      <h4 className="mb-4">Existing Solutions</h4>
      {solutions.length === 0 ? (
        <p className="text-muted">No solutions found yet.</p>
      ) : (
        <Row>
          {solutions.map(solution => (
            <Col md="6" lg="4" key={solution.id} className="mb-4">
              <Card className="h-100 shadow-sm position-relative">
                <CardBody>
                  {editingId === solution.id ? (
                    <>
                      <FormGroup>
                        <Label for={`editTitle-${solution.id}`}>Title</Label>
                        <Input
                          id={`editTitle-${solution.id}`}
                          type="text"
                          value={editForm.title}
                          onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for={`editDescription-${solution.id}`}>Description</Label>
                        <Input
                          id={`editDescription-${solution.id}`}
                          type="textarea"
                          value={editForm.description}
                          onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </FormGroup>
                      <div className="d-flex justify-content-end gap-2">
                        <Button color="success" onClick={() => saveEdit(solution.id)}><FaSave /> Save</Button>
                        <Button color="secondary" onClick={cancelEditing}><FaTimes /> Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <CardTitle tag="h5" className="text-dark">{solution.title}</CardTitle>
                      <CardText>{solution.description}</CardText>

                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <Button
                          color="info"
                          size="sm"
                          onClick={() => navigate(`/solutions/${solution.id}/steps`)}
                        >
                          Manage Steps
                        </Button>
                      </div>

                      <div
                        className="position-absolute"
                        style={{ top: '10px', right: '10px', display: 'flex', gap: '10px' }}
                      >
                        <Button color="link" className="p-0 text-primary" title="Edit" onClick={() => startEditing(solution)}>
                          <FaEdit size={18} />
                        </Button>
                        <Button color="link" className="p-0 text-danger" title="Delete" onClick={() => deleteSolution(solution.id)}>
                          <FaTrash size={18} />
                        </Button>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default ProblemSolutions;
