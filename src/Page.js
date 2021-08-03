import React, { useState, useEffect, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { APIModuleData } from './APIModule';
import PQueue from 'p-queue/dist';

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
    width: '10%',
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

  let uploadIds = createRef();

  const url_blocked_ids = 'https://d32kd3i4w6exck.cloudfront.net/api/get-blocked-ids';

  const [itemNotBlocked, setItemNotBlocked] = useState([]);

  const [itemShouldBeDeleted, setItemShouldBeDeleted] = useState([]);

  const [blockedIds, setBlockedIds] = useState([]);

  const [status, setStatus] = useState();

  const [concurrency, setConcurrency] = useState('');

  const [disabled, setDisabled] = useState(true);

  const url_sold_out = 'https://d32kd3i4w6exck.cloudfront.net/api/is-sold-out/33776097';

  async function getBlockedIds() {
    // get blocked ids API
    let blocked_ids = await APIModuleData.getAPI(url_blocked_ids).then(res => res);
    let convert_blocked_ids = await convertStringToArr(blocked_ids);
    let items_not_blocked = await getItemsNotBlocked(convert_blocked_ids);

    setBlockedIds(convert_blocked_ids);
    setItemNotBlocked(items_not_blocked);
  }

  function convertStringToArr(stringArr) {
    let arr = [];
    let re = /\s|,\s|,/; // ' ' or ', ' or '\n' 
    arr = stringArr.split(re);
    
    return arr.map(item => {
      return parseInt(item)
    });
  }

  function getItemsNotBlocked(blocked_ids) {
    let upload_ids = uploadIds.current.value;
    let arr_upload_ids = convertStringToArr(upload_ids);

    return arr_upload_ids.filter(item => {
      // upload ids - blocked ids
      if(!blocked_ids.includes(item)) {
        return item;
      }
    })
  }

  const urls = [
    'https://jsonplaceholder.typicode.com/todos/1',
    'https://jsonplaceholder.typicode.com/todos/2',
    'https://jsonplaceholder.typicode.com/todos/3',
    'https://jsonplaceholder.typicode.com/todos/4',
    'https://jsonplaceholder.typicode.com/todos/5',
    'https://jsonplaceholder.typicode.com/todos/6',
    'https://jsonplaceholder.typicode.com/todos/7',
    'https://jsonplaceholder.typicode.com/todos/8',
    'https://jsonplaceholder.typicode.com/todos/9',
    'https://jsonplaceholder.typicode.com/todos/10'
  ];
  
  async function getItemShouldBeDeleted() {
    const queue = new PQueue({ concurrency: concurrency });

    const items = [];

    let count = 0;

    // Emitted every time the add method is called and the number of pending or queued tasks is increased.
    queue.on('add', () => {
      console.log(`Task is added.  Size: ${queue.size}  Pending: ${queue.pending}`);
    });
    
    // Emitted every time a task is completed and the number of pending or queued tasks is decreased. 
    queue.on('next', () => {
      console.log(`Task is completed.  Size: ${queue.size}  Pending: ${queue.pending}`);
    });

    // Emitted as each item is processed in the queue for the purpose of tracking progress.
    queue.on('active', () => {
      count++;
      // console.log(`Working on item #${++count}.  Size: ${queue.size}  Pending: ${queue.pending}`);
      let percent = count*100/urls.length;
      setProgress(percent);
    });

    // all promise completed and queue empty
    queue.on('idle', () => {
      console.log(`Queue is idle.  Size: ${queue.size}  Pending: ${queue.pending}`);
      setItemShouldBeDeleted(items);
      alert('Done!')
    });
    
    urls.map(url => {
      queue.add(() => APIModuleData.getAPI(url).then(res => items.push(res.id)))
    });

    // api sold out
    await APIModuleData.getAPI(url_sold_out).then(res => {
      setStatus(res.status)
    });
  }

  function handleConcurrencyChange(e) {
    let value = e.target.value;
    setConcurrency(parseInt(value));
    setDisabled(false);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2} >
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Upload Ids </label>
          <TextareaAutosize ref={uploadIds} aria-label="minimum height" minRows={3} 
            placeholder="35001159 35025484 35078336"
          />;
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.btnButton}>Blocked Ids
            <Button variant="contained" onClick={getBlockedIds}>Fetch</Button>
          </label>
          <TextareaAutosize aria-label="minimum height" minRows={3} defaultValue={blockedIds} />;
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Items not blocked</label>
          <TextareaAutosize aria-label="minimum height" minRows={3} defaultValue={itemNotBlocked} />;
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Item should be deleted</label>
          <TextareaAutosize aria-label="minimum height" minRows={3} defaultValue={status ? itemShouldBeDeleted : ''} />;
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <div className={classes.progress}>
          <LinearProgressWithLabel value={progress} />
        </div>
      </Grid>
      <Grid container spacing={2} className={classes.concurrency}>
        <label >Concurrency</label>
        <TextField 
          id="outlined-basic" 
          size="small" 
          type="number" 
          // inputRef={concurrency} 
          variant="outlined" 
          className={classes.btnConcurrency} 
          onChange={handleConcurrencyChange} 
        />
        <Button variant="contained" onClick={getItemShouldBeDeleted} disabled={disabled}>Fetch</Button>
      </Grid>
    </div>
  );
}