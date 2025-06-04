import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  ProgressBar,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import FromField from "../components/FormField";
import { getError } from "../utils/getError";
import { uploadImage } from "../utils/uploadAWSfunc";
import toast from "react-hot-toast";
import MapScreen from "../components/MapScreen";
import axios from "axios";

function Analyzer() {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  // const [formData, setFormData] = useState({});
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("Test description");
  //   const [picToUpload, setPicToUpload]= useState(null)
  const [picPreview, setPicPreview] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [prediction, setPrediction] = useState(null);
  //   const [pic,setPic] = useState(null);

  const [fruit, setFruit] = useState("apple");
  const [fileObject, setFileObject] = useState(null);
  const placeholder = "/images/placeholder.jpg";
  //   useEffect(() => {
  //     const fetchProfile = async () => {

  //       const url = '/api/farmer/profile'

  //       try {
  //         const response = await api.get(url, {
  //           headers: {
  //             Authorization: token,
  //           },
  //         });
  //         console.log(response);

  //         const { data } = response.data;
  //         setFormData(data);
  //         console.log(data);
  //       } catch (error) {
  //         getError(error);
  //       }
  //     };

  //     fetchProfile();
  //   }, [token]);

  const fetchPrediction = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fruit", fruit);
    try {
      const response = await axios.post(
        "http://localhost:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      const serverPrediction = response?.data?.prediction;
      setPrediction(serverPrediction);
      setDescription(response?.data?.description);
    } catch (err) {
      console.error("Failed to fetch prediction:", err);
      toast.error("Could not get prediction from model.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Name:", name);
    console.log("Value:", value);
    // setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0].size > 5000000) {
      toast.error("Image size is too large. (max size 5MB)");
      setPicPreview(null);
      return;
    }

    const selectedImg = e?.target?.files[0];
    //    setPicToUpload(selectedImg)
    //    setPicPreview(URL.createObjectURL(selectedImg));
    setFileObject(selectedImg);
    fetchPrediction(selectedImg);
    handleImgUpload(selectedImg);
  };

  const handleImgUpload = async (picToUpload) => {
    try {
      if (!picToUpload) {
        return;
      }
      try {
        //   dispatch(showLoading());
        const location = await uploadImage(
          picToUpload,
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        //  setPic(location);
        setImage(location);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);

        toast.success("Image Uploaded successfully");

        // handleSubmit(location, description);

        //   dispatch(hideLoading());
      } catch (error) {
        //   dispatch(hideLoading());
        getError(error);
      }
    } catch (error) {
      getError(error);
      console.log(error);
    }
  };

  const handleSubmit = async (image, description) => {
   // e.preventDefault();

    const url = "/api/farmer/plant";
    console.log(image, description);
    try {
      // console.log("Form Data: ", formData);
      const response = await api.post(
        url,
        {
          image,
          description,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);

      const { data } = response.data;
    
      // setFormData(data);
      // setIsEditing(false);
    } catch (error) {
      getError(error);
    }
  };

  return (
    <section className="d-flex justify-content-center align-items-center custom-section py-5">
      <Container className="p-3 rounded-4 glass-morf">
        <h5 className="my-3 text-center fw-bold">Analyzer</h5>
        <p className="text-center">
          Feed in all the information to generate the crop report
        </p>

        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(image, description);
          }}
        >
          <Row>
            {/* <Col>
              <FromField
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Col> */}
          </Row>
          <Row className="d-flex justify-content-center text-center">
            <Col md={6} style={{ display: "grid", placeItems: "center" }}>
              <div
                className=" rounded p-2 m-2"
                style={{
                  border: "2px solid white",
                  maxHeight: "40vh",
                  height: "100%",
                  aspectRatio: "1/1",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={image || placeholder}
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>

              <FromField
                type="file"
                accept="image/*"
                label="Upload crop picture"
                onChange={handleImageChange}
              />

              <Form.Group className="mt-2">
                <Form.Label>Fruit Type</Form.Label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Form.Control
                    as="select"
                    value={fruit}
                    onChange={(e) => setFruit(e.target.value)}
                    style={{ appearance: "none", paddingRight: "2rem" }}
                  >
                    <option value="apple">Apple</option>
                    <option value="pomegranate">Pomegranate</option>
                  </Form.Control>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "1rem",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </Form.Group>

              <ProgressBar
                className="my-3 w-100"
                now={uploadPercentage}
                label={`Uploading... ${uploadPercentage}%`}
                variant="success"
              />
            </Col>
          </Row>

          {/* <Button
            className="px-4 me-3"
            onClick={() => setIsEditing((prev) => !prev)}
          >
            {isEditing ? "Cancel" : "Edit"} 
           </Button>  */}
          <Row>
            <Col className="text-end">
              <Button className="mx-3 " type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>

        {prediction && (
          <div
            className="mt-4 p-3 border rounded text-black"
            style={{
              backdropFilter: "blur(10px)",
              background: "rgba(172, 172, 172, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <h6 className="mb-2">🩺 Crop Disease Prediction</h6>
            <p>
              <strong>Disease:</strong> {prediction.prediction}
            </p>
            <p>
              <strong>Confidence:</strong>{" "}
              {(prediction.confidence * 100).toFixed(0)}%
            </p>
            <p>{prediction.description}</p>
            <p>
              <strong>Recommended Treatment:</strong> {prediction.solution}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

export default Analyzer;
