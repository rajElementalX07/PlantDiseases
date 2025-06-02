import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import FromField from "../components/FormField";
import { getError } from "../utils/getError";
import { setUser } from "../features/userSlice";

function ProfilePage() {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState("");


  useEffect(() => {
    const fetchProfile = async () => {

      const url = '/api/farmer/profile'

      try {
        const response = await api.get(url, {
          headers: {
            Authorization: token,
          },
        });
        console.log(response);

        const { data } = response.data;
        setFormData(data);
        console.log(data);
      } catch (error) {
        getError(error);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Name:", name);
    console.log("Value:", value);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  const updateProfile = async (e) => {
    e.preventDefault();

    const url = '/api/farmer/profile';

    try {
      console.log("Form Data: ", formData);
      const response = await api.put(
        url,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);

      const { data } = response.data;
      setFormData(data);
      dispatch(setUser({user:data}))
      setIsEditing(false);
    } catch (error) {
      getError(error);
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center custom-section">
      <Container className="p-3 rounded-4 glass-morf">
        <h5 className="my-3 text-center fw-bold">
        Farmer's Profile
        </h5>

        <Form>
          <Row>
            <Col>
              <FromField
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Col>
            <Col>
              <FromField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <FromField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Col>
            <Col>
              <FromField
                label="Mobile No."
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Col>
          </Row>

         

          <Button
            className="px-4 me-3"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          {isEditing && (
            <Button className="mx-3" onClick={updateProfile}>
              Update
            </Button>
          )}
        </Form>
      </Container>
    </section>
  );
}

export default ProfilePage;
