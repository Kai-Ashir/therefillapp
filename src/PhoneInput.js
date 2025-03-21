import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ref, update, onValue, get } from "firebase/database";
import { database } from "./firebase";
import { TextField, Button, Box, Typography, Container, Paper, CircularProgress } from "@mui/material";
import { getFunctions, httpsCallable } from "firebase/functions";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded"; 

function PhoneInput() {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const station = searchParams.get("station") || "";
  const [error, setError] = useState(false);
  const [isLocked, setIsLocked] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lockRef = ref(database, "requests-locked");
    const unsubscribe = onValue(lockRef, (snapshot) => {
      setIsLocked(snapshot.val() === true);
    });
    return () => unsubscribe();
  }, []);
  if (isLocked === null) {
      return (
        <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "100vh",
          width: "100vw",
          background: "linear-gradient(145deg,#c2ffde,#7bd3f9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          margin: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></Container>
      );
    }
  if (isLocked) {
    return (
      <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(145deg,#c2ffde,#7bd3f9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "70%",
          maxWidth: "70%",
          padding: 4,
          backgroundColor: "fff",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(145, 144, 144, 0.5), 0 0 8px rgba(90, 90, 90, 0.2)",
          animation: "fade-in 0.5s ease-in-out",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <CancelRoundedIcon
            sx={{
              fontSize: 100, // Big icon
              color: "#d32f2f", // Red color
            }}
          />
          <Typography
            fontSize={30}
            align="center"
            sx={{
              color: "#000",
              fontFamily: "'Josefin Sans', sans-serif",
            }}
            padding={.5}
          >
            Not Being Refilled
          </Typography>
          <Typography
            fontSize={20}
            align="center"
            sx={{
              color: "#000",
              fontFamily: "'Josefin Sans', sans-serif",
            }}
            padding={.5}
          >
            We're sorry, the dining hall is closing soon and we are no longer refilling this item.
          </Typography>
        </Box>
      </Paper>
    </Container>
    );
  }
  const handleSubmit = async () => {
    const phoneRegex = /^\+?[\d\s\-()]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError(true);
      return;
    }
    setLoading(true);
  
    const functions = getFunctions();
    const handleSubmitFunc = httpsCallable(functions, "handleSubmit");
  
    try {
      const response = await handleSubmitFunc({ phoneNumber, station });
      const data = response.data;
  
      if (data.success) {
        console.log("Phone number added successfully:", data.message);
        setLoading(false);
        navigate("/thank-you");
      } else {
        setLoading(false);
        console.error("Error updating phone number:", data.error);
      }
    } catch (error) {
      setLoading(false);
      console.error("Function call failed:", error);
    }
  };

  const handleSkip = () => {
    navigate("/thank-you");
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(145deg,#c2ffde,#7bd3f9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        margin: 0,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "70%",
          maxWidth: "70%",
          padding: 4,
          backgroundColor: "fff",
          borderRadius: "16px",
          boxShadow: "0 4px 16px rgba(145, 144, 144, 0.5), 0 0 8px rgba(90, 90, 90, 0.2)",
          animation: "fade-in 0.5s ease-in-out",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography
            fontSize={30}
            align="center"
            sx={{
              color: "#000",
              fontFamily: "'Josefin Sans', sans-serif",
            }}
            padding={.5}

          >
            Get Notified?
          </Typography>
          <Typography
            fontSize={20}
            align="center"
            sx={{
              color: "#000",
              fontFamily: "'Josefin Sans', sans-serif",
            }}
            padding={.5}
          >
            Get notified when your milk has been refilled
          </Typography>
          <TextField
            value={phoneNumber}
             onChange={(e) => {
                setPhoneNumber(e.target.value)
                setError(false);
            }}
            type="tel"
            label="Phone Number (Optional)"
            error={error}
            helperText={error ? "Please enter a valid phone number" : ""}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row", 
              gap: 2, 
              justifyContent: "space-between", 
            }}
          >
          <Button 
            onClick={handleSkip}
            style={{ fontSize: "1.2rem", color: '#0096ff', fontWeight: 400, textTransform: 'none' }}
          >Skip</Button>
          <Button
            type="button"
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              background: "#0096ff",
              color: "#fff",
              borderRadius: "12px",
              minHeight: "50px",
              minWidth: "110px",
              fontSize: "1.2rem",
              fontWeight: 400,
              padding: "12px 12",
              textTransform: "none",
              fontSize: "1.2rem",
              transition: "all 0.3s",
              "&:hover": {
                background: "#0096ff",
                transform: "scale(1.02)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: "white"}} /> : "Submit"}
          </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default PhoneInput;

