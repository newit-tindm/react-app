import React from 'react';
import { Box, Grid } from '@material-ui/core';
import NativeSelect from '@material-ui/core/NativeSelect';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import FormControl from '@material-ui/core/FormControl';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import RadioButton from './radioButton.jsx';
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

  return (
    <div className="layout">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="right"
      >
        <FormControl className={classes.margin}>
          {/* <InputLabel htmlFor="demo-customized-select-native">Age</InputLabel> */}
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
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
        p={2}
      >
        <label> System </label>
        {['Kisaragi', 'Fumizuki', 'Odawara', 'Xianvu'].map(label => (
          <RadioButton label={label} />
        ))}
      </Box>
      <Box
        display="flex"
        flex-direction="row"
        justifyContent="flex-end"
        width={1}
        height={1}
      >
        <label> Items ids </label>
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
        p={2}
        pr={0}
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
    </div>
  )
}
