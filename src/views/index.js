import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { APIModule } from '../APIModule';
import PQueue from 'p-queue/dist';
import { ProgressBar } from './progress.jsx';
import InputTextarea from './inputTextarea.jsx';
import FetchButton from './fetchButton';
import './style.css';

export default function Page() {

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
  const url_sold_out = 'https://k53bmxe71g.execute-api.ap-northeast-1.amazonaws.com/Stage/is-sold-out';

  const getBlockedIds = async () => {
    if(!blockedIds.length) {
      setIsLoading(true);
    }
    // get blocked ids API
    let blocked_ids = await APIModule.getAPI(url_blocked_ids).then(res => res);
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

  const convertStringToArr = (str) => {
    let re = /\s|,\s|,/; // (' ' || ', ' || '\n')
    let arr = str.split(re);
    return arr.map(item => {
      return parseInt(item)
    });
  }

  const getItemsNotBlocked = (blocked_ids, upload_ids) => {
    let items_not_blocked = upload_ids.filter(item => {
      // upload ids - blocked ids
      if(!blocked_ids.includes(item)) {
        return item;
      }
    })

    return items_not_blocked;
  }
  
  const getItemsShouldBeDeleted = () => {
    if (itemsNotBlocked.length) {
      setDisabled(true);

      const items_not_blocked = convertStringToArr(itemsNotBlocked);

      const arr_items = chunkArray(items_not_blocked, concurrency);
    
      const queue = new PQueue({ concurrency: 1 });

      const items = [];
      let count = 0;

      // Emitted every time the add method is called and the number of pending or queued tasks is increased.
      queue.on('add', () => {
        console.log(`Task is added.  Size: ${queue.size}  Pending: ${queue.pending}`);
      });
      
      // Emitted every time a task is completed and the number of pending or queued tasks is decreased. 
      queue.on('next', () => {
        console.log(`Task is completed.  Size: ${queue.size}  Pending: ${queue.pending}`);
        let percent = (++count)*100/arr_items.length;
        setProgress(percent);
      });

      // all promise completed and queue empty
      queue.on('idle', () => {
        console.log(`Queue is idle.  Size: ${queue.size}  Pending: ${queue.pending}`);
        setItemsShouldBeDeleted(dataOutput(items));
        setDisabled(false);
        alert('Done!');
      });

      // Emitted when an item completes without error
      queue.on('completed', result => {
        result.data.filter(item => {
          if(item.status) {
            return items.push(item.id);
          }
        })
      });

      // Emitted if an item throws an error.
      queue.on('error', error => {
        console.error(error);
      });
      
      arr_items.map((ids, index) => {
        queue.add(() => APIModule.postAPI(url_sold_out, ids));                    
        console.log('added ', index);
      });
    }
  }

  const chunkArray = (array, size) => {
    let result = []
    for (let i = 0; i < array.length; i += size) {
        let chunk = array.slice(i, i + size)
        result.push(chunk)
    }
    return result
  }

  const handleConcurrency = (e) => {
    let value = e.target.value;
    setConcurrency(parseInt(value));
    setDisabled(false);
  }

  const dataOutput = (data) => {
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
    <div className="layout">
      <Box 
        display="flex" 
        flexDirection="row"
        justifyContent="center"
      >
        <InputTextarea 
          label={'Uploaded ids'}
          placeholder="
            12345678
            12344555
            11222222"
          value={uploadIds}
          onChange={handleUploadIds}
        />
        <InputTextarea
          label={'Blocked ids'}
          isLoading={isLoading}
          value={blockedIds}
          btnClick={getBlockedIds}
        />
        <InputTextarea 
          label={'Items not blocked'}
          value={itemsNotBlocked}
        />
        <InputTextarea 
          label={'Items should be deleted'}
          value={itemsShouldBeDeleted}
        />
      </Box>
      <Box 
        display="flex" 
        flexDirection="row"
        justifyContent="center"
        p={2}
      >
        <ProgressBar progress={progress} />
      </Box>
      <Box 
        display="flex" 
        flexDirection="row"
        justifyContent="center"
        p={2}
      >
        <label className="label-concurrency">Concurrency</label>
        <TextField 
          id="outlined-basic" 
          size="small" 
          type="number"
          variant="outlined" 
          className="input-concurrency" 
          onChange={handleConcurrency} 
        /> 
        <FetchButton onClick={getItemsShouldBeDeleted} disabled={disabled} />
      </Box>
      <Box 
        display="flex" 
        flexDirection="row"
        justifyContent="center"
        p={2}
      >
        <label> Items: {countItems} </label>
      </Box>
    </div>
  );
}