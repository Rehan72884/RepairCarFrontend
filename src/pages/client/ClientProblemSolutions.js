import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  Button,
  Alert,
  Badge,
} from "reactstrap";

const ProblemSolutions = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`/api/problems/${problemId}/solutions`, {
        headers: authHeader(),
      })
      .then((res) => {
        let data = res.data || [];

        // Sort solutions descending by average_rating, fallback to 0 if no rating
        data.sort((a, b) => {
          const ratingA = Number(a.average_rating) || 0;
          const ratingB = Number(b.average_rating) || 0;
          return ratingB - ratingA;
        });

        setSolutions(data);
      })
      .catch((err) => {
        console.error("Error loading solutions", err);
        setError("Failed to load solutions.");
      });
  }, [problemId]);

  return (
    <Container className="py-4">
      <Button color="secondary" onClick={() => navigate(-1)}>
        ⬅ Back
      </Button>
      <h2 className="text-primary mt-4 mb-3">Solutions for the Problem</h2>

      {error && <Alert color="danger">{error}</Alert>}

      <Card>
        <CardBody>
          <CardTitle tag="h5">Solution List</CardTitle>
          {solutions.length > 0 ? (
            <ListGroup className="mt-3">
              {solutions.map((solution) => (
                <ListGroupItem
                  key={solution.id}
                  action
                  onClick={() =>
                    navigate(`/client/solutions/${solution.id}/steps`)
                  }
                  className="d-flex flex-column"
                >
                  <strong>{solution.title}</strong>
                  <span className="text-muted">{solution.description}</span>

                  {/* Feedback summary */}
                  <div className="mt-2 d-flex align-items-center gap-3">
                    <Badge color="success" pill>
                      👍 {solution.likes || 0}
                    </Badge>
                    <Badge color="danger" pill>
                      👎 {solution.dislikes || 0}
                    </Badge>
                    <Badge color="warning" pill>
                      ⭐{" "}
                      {solution.average_rating
                        ? Number(solution.average_rating).toFixed(1)
                        : "N/A"}
                    </Badge>
                  </div>
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
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export default ProblemSolutions;
