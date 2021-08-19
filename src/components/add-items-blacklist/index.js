import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  InputLabel,
  NativeSelect,
  makeStyles,
  withStyles,
  InputBase,
  FormControl,
  TextareaAutosize,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel
} from '@material-ui/core';
import './style.css';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    // fontFamily: [
    //   '-apple-system',
    //   'BlinkMacSystemFont',
    //   '"Segoe UI"',
    //   'Roboto',
    //   '"Helvetica Neue"',
    //   'Arial',
    //   'sans-serif',
    //   '"Apple Color Emoji"',
    //   '"Segoe UI Emoji"',
    //   '"Segoe UI Symbol"',
    // ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  margin: {
      margin: theme.spacing(1),
  },
}));

export default function AddItemsBlacklist() {
  const classes = useStyles();
  const [selectedValue, setSelectedValue] = useState('Kisaragi');

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  }

  return (
    <div className="layout-blacklist">
      <Grid className="grid-container">
        <label></label>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="right"
        >
          <FormControl className={classes.margin}>
            <InputLabel htmlFor="demo-customized-select-native">Select list</InputLabel>
            <NativeSelect
              id="demo-customized-select-native"
              // value={age}
              // onChange={handleChange}
              input={<BootstrapInput />}
            >
              <option aria-label="None" value="" />
              <option value={10}>Add items blacklist</option>
              <option value={20}>Add items seller list</option>
            </NativeSelect>
          </FormControl>
        </Box>
        <label className="label-select">System</label>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent=""
        >
          <FormControl component="fieldset">
            <RadioGroup name="select-system" value={selectedValue} onChange={handleChange}>
              <Box
                display="flex"
                flex-direction="column"
                justify-content="center"
              >
                {['Kisaragi', 'Fumizuki', 'Odawara', 'Xianvu'].map(value => (
                  <FormControlLabel 
                    value={value} 
                    control={<Radio />} 
                    label={value} 
                    className={value !== 'Kisaragi' ? "box-radio" : ''}
                  />
                ))}
              </Box>
            </RadioGroup>
          </FormControl>
        </Box>
        <label> Items ids </label>
        <Box
          display="flex"
          flex-direction="row"
          justifyContent=""
        >
          <TextareaAutosize
            aria-label="maximum height" 
            maxRows={50} 
            minRows={50}
            className="aria-text"
          />
        </Box>
        <Box
          display="flex"
          flex-direction="row"
          justifyContent="flex-end"
          className="box-btn"
        >
          <Button 
            variant="contained" 
            color="secondary"
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            className="btn-add"
          >
            Add
          </Button>
        </Box>
      </Grid>
    </div>
  )
}
