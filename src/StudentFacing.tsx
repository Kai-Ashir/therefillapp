import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ref, onValue, update, get } from "firebase/database";
import { database } from "./firebase";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Dialog,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

interface Item {
  itemName: string;
  phones?: Record<string, string>;
  timeAgo?: string;
  status?: string;
  requests?: number;
}

function StudentFacing() {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const station = searchParams.get("station") || "";
  const navigate = useNavigate();

  const handleConfirmClick = () => {
    const itemRef = ref(database, `items`);
    get(itemRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const matchingItem = Object.entries(data).find(([_, item]) =>
          (item as Item).itemName === station
        );

        if (matchingItem) {
          const [key, item] = matchingItem;

          // Check if timeAgo is not "N/A"
          if ((item as Item).timeAgo === "N/A") {
              update(ref(database, `items/${key}`), {
                  status: "Refill",
                  timeAgo: new Date().toISOString(),
                  requests: ((item as Item).requests || 0) + 1 // Add default value of 0
              });
          } else {
              update(ref(database, `items/${key}`), {
                  status: "Refill",
                  requests: ((item as Item).requests || 0) + 1 // Add default value of 0

              });
          }
        }
      }
    });
    navigate("/phone-input"+`?station=${station}`);
  };

  const translator = {
    regularmilk: "the 2% milk",
    skimmilk: "the skim milk",
    chocolatemilk: "the chocolate milk",
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          <Typography
            fontSize={30}
            align="center"
            sx={{
              color: "#000",
              fontFamily: "'Josefin Sans', sans-serif",
            }}
            padding={.5}
          >
            Confirm Action
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
            Is {translator[station]} empty? Staff will be notified to refill it.
          </Typography>
          <Button
            type="button"
            variant="contained"
            size="large"
            onClick={handleConfirmClick}
            sx={{
              background: "#0096ff",
              color: "#fff",
              width: "80%",
              borderRadius: "12px",
              fontWeight: 400,
              padding: "10px 12px",
              textTransform: "none",
              fontSize: "1.3rem",
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
            Confirm
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default StudentFacing;
