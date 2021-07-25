import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '60%',
    marginLeft: '20%',
    marginTop: '50px'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  display: {
      display: 'grid',
      marginBottom: '10px',
      textAlign: 'center',
  },
  button: {
    marginBottom: '20px'
  },
  btnButton: {
    marginBottom: '4px',
  },
  progress: {
    width: '50%',
    marginLeft: '25%',
    marginBottom: '20px',
  },
  concurrency: {
    display: 'inline-block',
    textAlign: 'center'
  },
  btnConcurrency: {
    marginRight: '10px',
    marginLeft: '10px',
    width: '5%'
  }
}));

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${props.value}%`}</Typography>
      </Box>
    </Box>
  );
}


LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function Page() {
  const classes = useStyles();
  const [progress, setProgress] = useState(0);

  let blocked_ids = [
    35001159,
    35025484,
    35078336,
    35113814,
    35114132
  ];

  let uploadIds = React.createRef();

  const [arrBlockedIds, setArrBlockedIds] = useState([]);

  const [itemNotBlocked, setItemNotBlocked] = useState([]);

  const [itemShouldBeDeleted, setItemShouldBeDeleted] = useState([]);

  const [concurrency, setConcurrency] = useState(0);

  function getBlockedIds() {
    setArrBlockedIds(blocked_ids);
    console.log('upload ids: ', uploadIds.current.value);
    console.log(convertToArrItems('items not blocked: ', uploadIds.current.value));
    setItemNotBlocked(convertToArrItems(uploadIds.current.value));
  };

  function convertToArrItems(items) {
    let stringToArr = items.split('\n');
    return stringToArr.filter(id => {
      // upload id not in blocked id
      if (blocked_ids.includes(parseInt(id))) {
        return id;
      }
    });
  }

  const urls = [
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/2',
    'https://jsonplaceholder.typicode.com/todos/3',
    'https://jsonplaceholder.typicode.com/todos/4',
    'https://jsonplaceholder.typicode.com/todos/5'
  ];

  function getItemShouldBeDeleted() {
    let items = [];
    let requests = urls.map(url => axios.get(url));
    Promise.all(requests).then(promises => {
      promises.forEach((res, index) => {
        setProgress((index+1)*100/urls.length);
        setConcurrency(index+1);
        return items.push(res.data.id);
      });
    })
    setItemShouldBeDeleted(items);
  }

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setProgress(1*100/urls.length);
  //   }, 800);
  //   return () => {
      
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <div className={classes.root}>
      <Grid container spacing={2} >
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Upload Ids </label>
          <TextareaAutosize ref={uploadIds} aria-label="minimum height" minRows={3} 
            placeholder="
                35001159
                35025484
                35078336
                35113814
                35114132
                35119822
                34746378
                34765819
                35054814
                35093244
                34215560
                34758645
              "
          />;
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.btnButton}>Blocked Ids
            <Button variant="contained" onClick={getBlockedIds}>Fetch</Button>
          </label>
          <TextareaAutosize aria-label="minimum height" minRows={3} defaultValue={arrBlockedIds} />;
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Items not blocked</label>
          <TextareaAutosize aria-label="minimum height" minRows={3} defaultValue={itemNotBlocked} />;
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Item should be deleted</label>
          <TextareaAutosize aria-label="minimum height" minRows={3} defaultValue={itemShouldBeDeleted} />;
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <div className={classes.progress}>
          <LinearProgressWithLabel value={progress} />
        </div>
      </Grid>
      <Grid container spacing={2} className={classes.concurrency}>
        <label >Concurrency</label>
        <TextField id="outlined-basic" size="small" label={`${concurrency}`} variant="outlined" className={classes.btnConcurrency} disabled={true} />
        <Button variant="contained" onClick={getItemShouldBeDeleted}>Fetch</Button>
      </Grid>
    </div>
  );
}