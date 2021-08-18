import React, { useState, useEffect, useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { APIModule } from '../APIModule';
import { ProgressBar } from './progress.jsx';
import InputTextarea from './inputTextarea.jsx';
import FetchButton from './fetchButton';
import './style.css';

export default function ItemsSoldOut() {

  const [itemsNotBlocked, setItemsNotBlocked] = useState([]);
  const [itemsShouldBeDeleted, setItemsShouldBeDeleted] = useState([]);
  const [uploadIds, setUploadIds] = useState([]);
  const [blockedIds, setBlockedIds] = useState([]);
  const [concurrency, setConcurrency] = useState(300);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [countItems, setCountItems] = useState(0);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef();

  const url_blocked_ids = 'https://d32kd3i4w6exck.cloudfront.net/api/get-blocked-ids';
  const url_sold_out = 'https://k53bmxe71g.execute-api.ap-northeast-1.amazonaws.com/Stage/is-sold-out';

  const getBlockedIds = async () => {
    if(!blockedIds.length) {
      setIsLoading(true);
    }
    // get blocked ids API
    let blocked_ids = await APIModule.getAPI(url_blocked_ids);
    if(uploadIds.length) {
      const remove_empty_line = removeEmptyLines(uploadIds);
      setUploadIds(dataOutput(remove_empty_line));
      const convert_blocked_ids = convertStringToArr(blocked_ids);
      const items_not_blocked = getItemsNotBlocked(convert_blocked_ids, remove_empty_line);
      setCountItems(items_not_blocked.length);
      setItemsNotBlocked(dataOutput(items_not_blocked));
    }
    setBlockedIds(blocked_ids);
  }

  const removeEmptyLines = (data) => {
    const convert_to_arr = convertStringToArr(data.trim());
    return convert_to_arr;
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
    // check items_not_blocked to enable button fetch
    if(items_not_blocked.length) {
      setDisabled(false);
    }
    return items_not_blocked;
  }

  const getItemsShouldBeDeleted = async () => {
    if (itemsNotBlocked.length) {
      setDisabled(true);
      const items_not_blocked = convertStringToArr(itemsNotBlocked);
      const arr_items = chunkArray(items_not_blocked, concurrency);
      const items = [];
      let count = 0;

      for (const item of arr_items) {
        const res = await APIModule.postAPI(url_sold_out, item);
        res.filter(data => {
          if (data && data.status) {
            return items.push(data.id);
          }
        });
        let percent = ++count*100/arr_items.length;
        // console.log('percent ', percent);
        // console.log('ids: ', count);
        setProgress(percent);
        if(percent === 100) {
          alert('Done!');
        }
        setItemsShouldBeDeleted(dataOutput(items));
      }
      setDisabled(false);
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
    let strValue = e.target.value;
    let value = parseInt(strValue);
    setConcurrency(value >= 50 ? value : concurrency);
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
      setDisabled(true);
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
          label={'Uploaded ids on Tmall'}
          placeholder="
            12345678
            12344555
            11222222"
          value={uploadIds}
          onChange={handleUploadIds}
        />
        <InputTextarea
          label={'Blocked ids on Brandear'}
          isLoading={isLoading}
          value={blockedIds}
          btnClick={getBlockedIds}
        />
        <InputTextarea 
          label={'Items not blocked on Brandear'}
          value={itemsNotBlocked}
        />
        <InputTextarea 
          label={'Items should be deleted on Tmall'}
          value={itemsShouldBeDeleted}
          handleCopy={true}
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
          defaultValue={concurrency}
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