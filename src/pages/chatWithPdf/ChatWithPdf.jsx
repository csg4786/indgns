import { useState, useEffect } from "react";
import * as Cite from "citation-js";
import * as parse from "bibtex-parser";
import axios from "axios";
import { Container, Stack, TextField, Button, LinearProgress, Typography, FormGroup, Tooltip, BottomNavigation, BottomNavigationAction, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardActions, CardContent, InputLabel, Select, MenuItem } from "@mui/material";
import { AutoFixHigh, Undo, Redo, ImportContacts } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { tooltipClasses } from "@mui/material/Tooltip";

import "./chatWithPdf.css";

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

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.black,
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.black,
    },
}));


function ChatWithPdf() {

  const [formData, setFormData] = useState({
    keyword: "",
    academic: true,
    limit: 10,
  });

  const [textInput, setTextInput] = useState("References : \n");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSwitchChange = (event) => {
    setFormData({ ...formData, academic: event.target.checked });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, keyword: event.target.value });
  };

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const [open, setOpen] = useState(false);

    // const [bibtex, setBibtex] = useState("");
    let bibtex;

    const [citeStyle, setCiteStyle] = useState("apa");

    const handleCitationStyle = (event) => {
        setCiteStyle(event.target.value);
    };

  const handleSearch = async () => {
    setLoading(true);
    const data = JSON.stringify(formData);
    // console.log(formData);

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
  
  const handleClickOpen = () => {
      setOpen(true);
  };
  
  const handleClose = () => {
    setContent([]);
    setOpen(false);
  };

  const handleCitation = (event) => {
        bibtex = content[(event.target.attributes.value.value)].citationStyles.bibtex;
        
        let example = new Cite(bibtex);

        let output = example.format("bibliography", {
          type: "string",
          template: citeStyle,
        });

        let str = textInput;
        setTextInput(str+"\n"+output);
        // console.log(citeStyle);
        setContent([]);
        setOpen(false);
    };

  return (
    <>
      <Container maxWidth="md">
        <Stack spacing={5}>
          <Stack direction="row" spacing={1} sx={{ display: "block" }}>
            <FormGroup>
              <Stack
                spacing={1}
                sx={{ backgroundColor: "#efeffd", borderRadius: "0.5rem" }}
              >
                <InputLabel id="style" sx={{textAlign: "left"}}>Citation Style</InputLabel>
                <Select
                  labelId="style"
                  id="cstyle"
                  value={citeStyle}
                  onChange={handleCitationStyle}
                  sx={{ width: "100%", textAlign: "left"}}
                >
                  <MenuItem value={"apa"}>APA</MenuItem>
                  <MenuItem value={"harvard1"}>Harvard</MenuItem>
                  <MenuItem value={"vancouver"}>Vancouver</MenuItem>
                </Select>
                <TextField
                  value={textInput}
                  onChange={handleTextInputChange}
                  fullWidth
                  multiline
                  rows={15}
                  variant="standard"
                  sx={{padding: "1rem"}}
                />
              </Stack>
            </FormGroup>
          </Stack>
        </Stack>
      </Container>
      <Container
        className="footer"
        maxWidth="md"
        sx={{ height: "5rem" }}
      ></Container>
      <Container
        maxWidth="md"
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          color: "#428cfb",
        }}
      >
        <BottomNavigation >
          <BootstrapTooltip title="Edit, improve, generate text">
            <BottomNavigationAction
              label="AI Commands"
              value="ai"
              icon={<AutoFixHigh />}
              sx={{ color: "#428cfb" }}
            />
          </BootstrapTooltip>
          <BootstrapTooltip title="Add Citation">
            <div>
              <BottomNavigationAction
                label="Cite"
                value="cite"
                icon={<ImportContacts />}
                sx={{ color: "#428cfb" }}
                onClick={handleClickOpen}
              />
              <Dialog open={open} onClose={handleClose} fullWidth>
                <DialogTitle>Add Citation</DialogTitle>
                <DialogContent>
                  <TextField
                    value={formData.keyword}
                    onChange={handleInputChange}
                    autoFocus
                    margin="dense"
                    id="keyword"
                    label="Search"
                    type="text"
                    fullWidth
                    variant="standard"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSearch}>Search</Button>
                </DialogActions>
                {loading && <BorderLinearProgress variant="indeterminate" />}
                <Stack marginY="1rem" spacing={1}>
                  {content.map((val, key) => {
                    return (
                      <Card key={key} sx={{ minWidth: 275 }}>
                        <CardContent>
                          <a href={val.url}>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              {val.url.substring(0, 50)}
                            </Typography>
                          </a>
                          <Typography variant="h5" component="div">
                            {val.title && val.title.length > 50
                              ? `${val.title.substring(0, 50)}...`
                              : val.title || "Not Available"}
                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {val.citationCount} Citations
                          </Typography>
                          <Typography variant="body2">
                            {val.abstract && val.abstract.length > 100
                              ? `${val.abstract.substring(0, 100)}...`
                              : val.abstract || "Not Available"}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button value={key} onClick={handleCitation} size="small">
                            Add
                          </Button>
                        </CardActions>
                      </Card>
                    );
                  })}
                </Stack>
              </Dialog>
            </div>
          </BootstrapTooltip>
          <BootstrapTooltip title="Undo">
            <BottomNavigationAction
              //   label="Undo"
              //   value="undo"
              icon={<Undo />}
              sx={{ color: "#428cfb" }}
            />
          </BootstrapTooltip>
          <BootstrapTooltip title="Redo">
            <BottomNavigationAction
              //   label="Redo"
              //   value="redo"
              icon={<Redo />}
              sx={{ color: "#428cfb" }}
            />
          </BootstrapTooltip>
        </BottomNavigation>
      </Container>
    </>
  );
}

export default ChatWithPdf;
