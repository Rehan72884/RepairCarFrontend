import ClientNotificationDropdown from "../../components/notification/ClientNotificationDropdown";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { FaComments } from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Alert,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

const ClientDashboard = () => {
  const [chatModal, setChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [experts, setExperts] = useState([]);
  const [selectedExperts, setSelectedExperts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState([]);
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [problems, setProblems] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars();
    fetchMyCars();
  }, []);

  const fetchCars = () => {
    setLoading(true);
    axios
      .get("/api/cars/list", { headers: authHeader() })
      .then((res) => {
        setCars(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load cars.");
        setLoading(false);
      });
  };

  const fetchMyCars = () => {
    axios
      .get("/api/client-cars/list", { headers: authHeader() })
      .then((res) => {
        setMyCars(res.data.data || []);
      })
      .catch(() => {
        setError("Failed to load your cars.");
      });
  };
  const fetchExperts = async () => {
    try {
      const [expertsRes, subscribedRes] = await Promise.all([
        axios.get("/api/experts/list", { headers: authHeader() }),
        axios.get("/api/users/my-subscriptions", { headers: authHeader() }),
      ]);

      setExperts(expertsRes.data.data || []);
      setAlreadySubscribed(subscribedRes.data.data || []);
    } catch (error) {
      console.error("Error fetching experts or subscriptions:", error.response || error.message);
      setError("Failed to load expert list or subscriptions.");
    }
  };
  const fetchChat = () => {
    axios
      .get("/api/messages", { headers: authHeader() })
      .then((res) => {
        setChatMessages(res.data || []);
      })
      .catch(() => {
        setError("Failed to load messages.");
      });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Find Admin from fetched users, or hardcode admin_id if known
    const adminUser = JSON.parse(localStorage.getItem("admin_user")); // OR hardcode receiver_id

    axios
      .post(
        "/api/messages/send",
        {
          receiver_id: adminUser?.id ?? 1, // replace with actual admin ID
          message: newMessage.trim(),
        },
        { headers: authHeader() }
      )
      .then((res) => {
        setNewMessage("");
        setChatMessages((prev) => [...prev, res.data]);
      })
      .catch(() => {
        setError("Failed to send message.");
      });
  };


  const handleAddToMyCars = (carId) => {
    axios
      .post(
        "/api/client-cars/store",
        { car_id: carId },
        { headers: authHeader() }
      )
      .then(() => {
        setSuccess("Car added to your list!");
        fetchMyCars();
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Failed to add car.");
        setTimeout(() => setError(""), 3000);
      });
  };

  const handleExpertSubscription = () => {
    axios
      .post(
        "/api/users/subscribe-expert",
        { expert_ids: selectedExperts },
        { headers: authHeader() }
      )
      .then((res) => {
        setSuccess("Experts subscribed successfully.");
        setShowModal(false);
        setSelectedExperts([]);
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Failed to subscribe experts.");
        setTimeout(() => setError(""), 3000);
      });
  };

  const handleRemove = (carId) => {
    axios
      .delete(`/api/client-cars/delete/${carId}`, { headers: authHeader() })
      .then(() => {
        setSuccess("Car removed successfully.");
        setMyCars((prev) => prev.filter((car) => car.id !== carId));
        setTimeout(() => setSuccess(""), 3000);
      })
      .catch(() => {
        setError("Failed to remove the car.");
        setTimeout(() => setError(""), 3000);
      });
  };

  const fetchProblems = (carId) => {
    if (problems[carId]) return; // already fetched
    axios
      .get(`/api/cars/${carId}/problems`, { headers: authHeader() })
      .then((res) => {
        setProblems((prev) => ({ ...prev, [carId]: res.data.data || [] }));
      })
      .catch(() => {
        setError("Failed to load problems.");
      });
  };

  return (
     <>
     <Modal isOpen={showModal} toggle={() => setShowModal(!showModal)}>
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          Subscribe to Experts
        </ModalHeader>
        <ModalBody>
          {experts.map((expert) => {
            const isAlreadySubscribed = alreadySubscribed.includes(expert.id);
            return (
              <FormGroup check key={expert.id}>
                <Label
                  check
                  className={isAlreadySubscribed ? "text-muted" : ""}
                >
                  <Input
                    type="checkbox"
                    value={expert.id}
                    checked={selectedExperts.includes(expert.id)}
                    onChange={(e) => {
                      const id = parseInt(e.target.value);
                      setSelectedExperts((prev) =>
                        e.target.checked
                          ? [...prev, id]
                          : prev.filter((x) => x !== id)
                      );
                    }}
                    disabled={isAlreadySubscribed}
                  />
                  {expert.name} ({expert.company})
                  {isAlreadySubscribed && " (Already Subscribed)"}
                </Label>
              </FormGroup>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={handleExpertSubscription}
            disabled={selectedExperts.length === 0}
          >
            Save Subscription
          </Button>
          <Button color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
     <div className="d-flex justify-content-end pe-4 pt-3">
      <ClientNotificationDropdown />
    </div>
    <Container className="py-4">
      <h2 className="text-primary mb-4">Available Cars</h2>

      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Row>
        {cars.map((car) => (
          <Col md="4" key={car.id} className="mb-4">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">
                  {car.company} - {car.model}
                </CardTitle>
                <p>
                  <strong>Year:</strong> {car.year}
                </p>

                {/* ✅ Wrap buttons in a flex container for horizontal alignment */}
                <div className="d-flex gap-2 mt-2">
                  <Button
                    color="success"
                    onClick={() => handleAddToMyCars(car.id)}
                  >
                    Add to My Cars
                  </Button>
                  <Button
                    color="info"
                    onClick={() => navigate(`/client/car/${car.id}/problems`)}
                  >
                    View Problems
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <hr className="my-5" />

      <h2 className="text-primary mb-4">My Cars</h2>

      <Row>
        {myCars.map((car) => (
          <Col md="6" key={car.id} className="mb-4">
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h5">
                  {car.company} - {car.model}
                </CardTitle>
                <p>
                  <strong>Year:</strong> {car.year}
                </p>

                <Button
                  color="danger"
                  size="sm"
                  onClick={() => handleRemove(car.id)}
                  className="me-2"
                >
                  Remove
                </Button>

                <Button
                  color="info"
                  size="sm"
                  onClick={() => navigate(`/client/car/${car.id}/problems`)}
                >
                  View Problems
                </Button>

                {problems[car.id] && problems[car.id].length > 0 && (
                  <ListGroup className="mt-3">
                    <ListGroupItem active>Problems</ListGroupItem>
                    {problems[car.id].map((problem) => (
                      <ListGroupItem key={problem.id}>
                        {problem.name}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                )}
              </CardBody>
            </Card>
          </Col>
        ))}
        <Button
            color="primary"
            onClick={() => {
              setShowModal(true);
              fetchExperts();
            }}
          >
            Subscribe Experts
          </Button>
      </Row>
    </Container>
    <div className="position-fixed bottom-0 end-0 mt-3 me-4 zindex-tooltip">
  <Button color="info" onClick={() => {
    setChatModal(true);
    fetchChat();
  }}>
    <FaComments className="me-2" />
    Chat with Admin
  </Button>
</div>

<Modal isOpen={chatModal} toggle={() => setChatModal(!chatModal)} size="lg">
  <ModalHeader toggle={() => setChatModal(!chatModal)}>Chat with Admin</ModalHeader>
  <ModalBody style={{ maxHeight: "400px", overflowY: "auto" }}>
    {chatMessages.length === 0 ? (
      <p>No messages yet.</p>
    ) : (
      <ul className="list-unstyled">
        {chatMessages.map((msg) => (
          <li
            key={msg.id}
            className={`mb-2 p-2 rounded ${msg.sender_id === getUserId() ? "bg-primary text-white text-end" : "bg-light text-start"}`}
          >
            <small>{msg.message}</small>
            <br />
            <small className="text-muted">{new Date(msg.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    )}
  </ModalBody>
  <ModalFooter className="d-flex">
    <Input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type your message..."
      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
    />
    <Button color="primary" onClick={handleSendMessage}>
      Send
    </Button>
  </ModalFooter>
</Modal>

    </>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
const getUserId = () => parseInt(localStorage.getItem("user_id"));
export default ClientDashboard;
