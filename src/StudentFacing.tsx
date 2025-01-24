import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
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
}

function StudentFacing() {
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const station = searchParams.get("station") || "";

  const handlePhoneSubmit = () => {
    const itemRef = ref(database, `items`);
    get(itemRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const matchingItem = Object.entries(data).find(([_, item]) =>
          (item as Item).itemName === station
        );

        if (matchingItem) {
          const [key, item] = matchingItem as [string, Item];
          const currentPhones = item.phones || {};
          const newPhones = {
            ...currentPhones,
            [Object.keys(currentPhones).length]: phoneNumber,
          };

          update(ref(database, `items/${key}`), {
            phones: newPhones,
          });

          setPhoneNumber("");
        }
      }
    });
    setOpenDialog(false);
  };

  const handleConfirmClick = () => {
    const itemRef = ref(database, `items`);
    get(itemRef).then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const matchingItem = Object.entries(data).find(([_, item]) =>
          (item as Item).itemName === station
        );

        if (matchingItem) {
          const [key] = matchingItem;
          update(ref(database, `items/${key}`), {
            status: "Refill",
          });
        }
      }
    });
    setOpenDialog(true);
  };

  const translator = {
    regularmilk: "the Regular milk",
    skimmilk: "the Skim milk",
    chocolatemilk: "the Chocolate milk",
  };

  return (
    <Container
    maxWidth={false}
    disableGutters
    sx={{
      height: "100vh",
      width: "100vw",
      background: "linear-gradient(145deg, #121212, #1a1a1a, #303030, #4a4a70)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      margin: 0,
      position: 'absolute',
      top: 0,
      left: 0,
    }}
  >
   <Paper
  elevation={6}
  sx={{
    width: "100%",
    maxWidth: "400px",
    padding: 4,
    backgroundColor: "#1e1e1e",
    borderRadius: "16px",
    border: "2px solid rgba(255, 255, 255, 0.3)", // White border with transparency
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.8), 0 0 10px rgba(90, 90, 90, 0.3)",
    animation: "fade-in 0.5s ease-in-out", // Subtle fade-in
  }}
>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography
          variant="h5"
          align="center"
          sx={{
            color: "#ffffff",
            fontFamily: "'Fira Code', monospace",
            textShadow: "0 0 6px rgba(255, 255, 255, 0.3)",
          }}
        >
          Is {translator[station]} empty?
        </Typography>
  
        <Divider
          sx={{
            borderColor: "rgba(255, 255, 255, 0.2)",
            borderStyle: "dashed",
          }}
        />
  
        <Button
          type="button"
          variant="contained"
          size="large"
          onClick={handleConfirmClick}
          sx={{
            background: "linear-gradient(90deg, #90caf9, #64b5f6)",
            color: "#000",
            borderRadius: "12px",
            fontWeight: "bold",
            padding: "12px 0",
            fontSize: "1.2rem",
            textTransform: "uppercase",
            transition: "all 0.3s",
            "&:hover": {
              background: "linear-gradient(90deg, #64b5f6, #90caf9)",
              transform: "scale(1.05)", // Slight scale-up on hover
            },
            "&:active": {
              transform: "scale(0.95)", // Slight scale-down on click
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
