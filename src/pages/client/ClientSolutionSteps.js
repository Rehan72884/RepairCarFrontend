import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Card, CardBody, CardTitle, ListGroup, ListGroupItem,
  Button, Alert, FormGroup, Label, Input
} from 'reactstrap';

const SolutionSteps = () => {
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(null); // true/false
  const [rating, setRating] = useState(0);  // 1 to 5
  const [feedback, setFeedback] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axios.get(`/api/solutions/${solutionId}/steps`, {
      headers: authHeader()
    }).then(res => {
      setSteps(res.data.data || []);
    }).catch(() => {
      setError('Failed to load steps.');
    });
  }, [solutionId]);

  const handleSubmitFeedback = () => {
  axios.post('/api/feedback/submit', {
    solution_id: parseInt(solutionId),
    liked,
    rating,
    feedback
  }, {
    headers: authHeader()
  }).then(res => {
    setSuccess('Feedback submitted successfully!');
    setError('');

    // Clear inputs
    setLiked(null);
    setRating(0);
    setFeedback('');

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  }).catch(() => {
    setSuccess('');
    setError('Failed to submit feedback.');
  });
  };


  return (
    <Container className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)}>⬅ Back</Button>
      <h2 className="text-primary mt-4 mb-3">Steps for the Solution</h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Card className="mb-4">
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

      {/* Feedback Section */}
      <Card>
        <CardBody>
          <CardTitle tag="h5">Submit Your Feedback for Solution</CardTitle>

          <FormGroup>
            <Label>Did you like the solution?</Label><br />
            <Button
              color={liked === true ? 'success' : 'secondary'}
              className="me-2"
              onClick={() => setLiked(true)}
            >
              👍 Like
            </Button>
            <Button
              color={liked === false ? 'danger' : 'secondary'}
              onClick={() => setLiked(false)}
            >
              👎 Dislike
            </Button>
          </FormGroup>

          <FormGroup className="mt-3">
            <Label>Rating (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={e => setRating(parseInt(e.target.value))}
            />
          </FormGroup>

          <FormGroup className="mt-3">
            <Label>Feedback</Label>
            <Input
              type="textarea"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </FormGroup>

          <Button color="primary" className="mt-3" onClick={handleSubmitFeedback}>
            Submit Feedback
          </Button>
        </CardBody>
      </Card><br/>
        <Card>
        <CardBody>
          <CardTitle tag="h5">Submit rating for Expert</CardTitle>

          <FormGroup>
            <Label>Did you like the Expert?</Label><br />
            <Button
              color={liked === true ? 'success' : 'secondary'}
              className="me-2"
              onClick={() => setLiked(true)}
            >
              👍 Like
            </Button>
            <Button
              color={liked === false ? 'danger' : 'secondary'}
              onClick={() => setLiked(false)}
            >
              👎 Dislike
            </Button>
          </FormGroup>

          <FormGroup className="mt-3">
            <Label>Rating (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={e => setRating(parseInt(e.target.value))}
            />
          </FormGroup>

          <FormGroup className="mt-3">
            <Label>Feedback</Label>
            <Input
              type="textarea"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </FormGroup>

          <Button color="primary" className="mt-3" onClick={handleSubmitFeedback}>
            Submit rating
          </Button>
        </CardBody>
      </Card>

    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default SolutionSteps;
