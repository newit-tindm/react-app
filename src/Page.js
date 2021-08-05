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
import { APIModuleData } from './APIModule';
import PQueue from 'p-queue/dist';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '60%',
    marginLeft: '20%',
    marginTop: '50px'
  },
  rootLoading: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  display: {
      display: 'grid',
      marginBottom: '30px',
      textAlign: 'center',
  },
  button: {
    marginBottom: '20px'
  },
  btnButton: {
    marginBottom: '4px',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '-11px'
  },
  btnFetch1: {
    marginLeft: '10px',
    marginRight: '10px',
  },
  progressStyle: {
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
    width: '5%',
  },
  label: {
    marginTop: '10px',
  },
  areaBtn: {
    marginTop: '10px',
  }
}));

function LinearProgressWithLabel(props) {
  console.log('progress ', props.value);
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

  const [itemsNotBlocked, setItemsNotBlocked] = useState([]);

  const [itemsShouldBeDeleted, setItemsShouldBeDeleted] = useState([]);

  const [uploadIds, setUploadIds] = useState([]);

  const [blockedIds, setBlockedIds] = useState([]);

  const [concurrency, setConcurrency] = useState('');

  const [disabled, setDisabled] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const [countItems, setCountItems] = useState(0);

  const [progress, setProgress] = useState(0);

  const url_blocked_ids = 'https://d32kd3i4w6exck.cloudfront.net/api/get-blocked-ids';

  const url_sold_out = 'https://d32kd3i4w6exck.cloudfront.net/api/is-sold-out/33776097';

  async function getBlockedIds() {
    if(!blockedIds.length) {
      setIsLoading(true);
    }
    
    // get blocked ids API
    let blocked_ids = await APIModuleData.getAPI(url_blocked_ids).then(res => res);

    if(uploadIds.length) {
      const remove_empty_line = removeEmptyLines(uploadIds);
      setUploadIds(dataOutput(remove_empty_line));
      const items_not_blocked = getItemsNotBlocked(blocked_ids, remove_empty_line);
      setCountItems(items_not_blocked.length);
      setItemsNotBlocked(dataOutput(items_not_blocked));
    }

    setBlockedIds(blocked_ids);
  }

  const removeEmptyLines = (data) => {
    const convert_to_arr = convertStringToArr(data);
    return convert_to_arr.filter(item => item);
  }

  function convertStringToArr(str) {
    let re = /\s|,\s|,/; // ' ' or ', ' or '\n' 
    let arr = str.split(re);
    return arr.map(item => {
      return parseInt(item)
    });
  }

  function getItemsNotBlocked(blocked_ids, upload_ids) {
    let items_not_blocked = upload_ids.filter(item => {
      // upload ids - blocked ids
      if(!blocked_ids.includes(item)) {
        return item;
      }
    })

    return items_not_blocked;
  }
  
  async function getItemsShouldBeDeleted() {
    let sold_out = await APIModuleData.getAPI(url_sold_out).then(res => res.status);

    if (true && itemsNotBlocked.length) {
      const items_should_be_deleted = convertStringToArr(itemsNotBlocked);
      
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
        let percent = (++count)*100/items_should_be_deleted.length;
        setProgress(percent);
        if(percent === 100) {
          alert('Done!');
        }
      });

      // all promise completed and queue empty
      queue.on('idle', () => {
        console.log(`Queue is idle.  Size: ${queue.size}  Pending: ${queue.pending}`);
        setItemsShouldBeDeleted(dataOutput(items));
        
      });
      
      items_should_be_deleted.map(item => {
        queue.add(() => items.push(item));
      });
    }
  }

  function handleConcurrency(e) {
    let value = e.target.value;
    setConcurrency(parseInt(value));
    setDisabled(false);
  }

  function dataOutput(data) {
    return data.toString().replaceAll(',', '\n');
  }

  const handleItemsNotBlocked = async (blocked_ids, upload_ids) => {
    let convert_blocked_ids = await convertStringToArr(blocked_ids);
    let convert_upload_ids = await convertStringToArr(upload_ids);
    let items_not_blocked = await getItemsNotBlocked(convert_blocked_ids, convert_upload_ids);
    setCountItems(items_not_blocked.length);
    return setItemsNotBlocked(dataOutput(items_not_blocked));
  }

  const handleUploadIds = (e) => {
    setUploadIds(e.target.value)
    if (!blockedIds.length) { // blocked ids is null
      setItemsNotBlocked(e.target.value);
      let items = convertStringToArr(e.target.value);
      setCountItems(items.length);
    } else {
      handleItemsNotBlocked(blockedIds, e.target.value);
    }
  }

  useEffect(() => {
    setIsLoading(false);
  }, [blockedIds]);

  return (
    <div className={classes.root}>
      <Grid container spacing={2} >
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Upload Ids </label>
          <TextareaAutosize
            aria-label="maximum height" 
            maxRows={30} 
            minRows={30}
            onChange={handleUploadIds}
            value={uploadIds}
            placeholder="
              35001159
              35025484
              35078336
            "
          />
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <Box component="div" m={1} className={classes.btnButton}>
            <label className={classes.label}>Blocked Ids</label>
            <Button className={classes.btnFetch1} variant="contained" onClick={getBlockedIds} disabled={isLoading}>Fetch</Button>
            {isLoading && 
              <div className={classes.rootLoading}>
                <CircularProgress 
                  color="primary"
                  size={30}
                />
              </div>
            }
          </Box>
          <TextareaAutosize className={classes.areaBtn} aria-label="maximum height" maxRows={30} minRows={30} defaultValue={blockedIds} />
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Items not blocked</label>
          <TextareaAutosize aria-label="maximum height" maxRows={30} minRows={30} defaultValue={itemsNotBlocked} />
        </Grid>
        <Grid item xs={3} md={3} className={classes.display}>
          <label className={classes.button}>Item should be deleted</label>
          <TextareaAutosize aria-label="maximum height" maxRows={30} minRows={30} defaultValue={itemsShouldBeDeleted} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <div className={classes.progressStyle}>
          <LinearProgressWithLabel value={progress} />
        </div>
      </Grid>
      <Grid container spacing={2} className={classes.concurrency}>
        <Box component="div" m={1} >
          <label >Concurrency</label>
          <TextField 
            id="outlined-basic" 
            size="small" 
            type="number"
            variant="outlined" 
            className={classes.btnConcurrency} 
            onChange={handleConcurrency} 
          /> 
          <Button variant="contained" onClick={getItemsShouldBeDeleted} disabled={disabled}>Fetch</Button>
        </Box>
        <Box component="div" mr={15} m={3} >
          <label >Items: {countItems} </label>
        </Box>
      </Grid>
    </div>
  );
}