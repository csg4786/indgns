import { useState } from "react";
import axios from "axios";
import { Container, Stack, TextField, Button, LinearProgress, Typography, FormGroup, FormControlLabel, Switch, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Search, ExpandMore } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from '@mui/material/LinearProgress';

import "./research.css";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));

function Research() {

  const [formData, setFormData] = useState({
    keyword: "",
    academic: false,
    limit: 10,
  });

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSwitchChange = (event) => {
    setFormData({ ...formData, academic: event.target.checked });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, keyword: event.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    const data = JSON.stringify(formData);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.gyanibooks.com/search_publication/",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try{
      const res = await axios(config);
      console.log(res.data.data);
      setContent(res.data.data);

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <Container maxWidth="md">
        <Stack spacing={5}>
          <Stack direction="row" spacing={1} sx={{ display: "block" }}>
            <FormGroup>
              <Stack
                direction="row"
                spacing={1}
                sx={{ backgroundColor: "#efeffd", borderRadius: "0.5rem" }}
              >
                <TextField
                  value={formData.keyword}
                  onChange={handleInputChange}
                  fullWidth
                  label="Search"
                  variant="standard"
                  required
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.academic}
                      onChange={handleSwitchChange}
                    />
                  }
                  label="Academic"
                  labelPlacement="start"
                  sx={{ color: "#428cfb", marginTop: "0.5rem" }}
                />
                <Button variant="contained" onClick={handleSearch}>
                  <Search />
                </Button>
              </Stack>
            </FormGroup>
          </Stack>
          <Stack spacing={1}>
            <Typography align="left" variant="" color={"#428cfb"}>
              Upgrade{"→"}
            </Typography>
            {loading && <BorderLinearProgress variant="indeterminate" />}
          </Stack>
        </Stack>
        <Stack marginY="1rem" spacing={1}>
          {
            content.map((val, key) => {
              return (<Accordion key={key+1}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <a href={val.url} target="_blank"><Typography variant="h6" textAlign={"left"}>{key+1}. {val.title}</Typography></a>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography marginBottom={"0.5rem"} textAlign={"justify"} ><strong>Total Citations:</strong> {val.citationCount}</Typography>
                  <Typography marginBottom={"0.5rem"} textAlign={"justify"} ><strong>Authors:</strong> {
                    val.authors.map((author, key2) => {
                      return (
                        <Typography variant="span" key={key2+1} textAlign={"justify"}>
                          {key2 > 0 && ", "}{" "}
                          {`${key2 + 1}. ${author["name"]}`}
                        </Typography>
                      );
                    })
                  }</Typography>
                  <Typography textAlign={"justify"} ><strong>Abstract:</strong> {(val.abstract) ? val.abstract : "Not Available"}</Typography>
                </AccordionDetails>
              </Accordion>);
            })
          }
        </Stack>
      </Container>
    </>
  );
}

export default Research;
