import React, { useRef } from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import './style.css';
import { ProgressLoading } from './progress.jsx';
import FetchButton from './fetchButton';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Button from '@material-ui/core/Button';

const InputTextarea = ({ 
    label,
    isLoading,
    placeholder,
    value,
    onChange,
    btnClick,
    handleCopy
}) => {
    const inputRef = useRef();

    const handleCopyClick = () => {
        inputRef.current.select();
        document.execCommand('copy');
    }

    return (
        <Box 
            display="flex" 
            flexDirection="column"
            alignItems="center"
            width="20%"
            p={2}
        >
            {btnClick ?
                <Box className="box-blocked-ids">
                    <label className="label-box">{ label }</label>
                    <FetchButton onClick={btnClick} isLoading={isLoading} />
                    {isLoading &&
                        <ProgressLoading />
                    }
                </Box> : handleCopy ? (
                    <Box
                        display="flex"
                        flex-direction="row"
                        justify-content="center"
                    >
                        <label className="label-text">{ label }</label>
                        <Button onClick={handleCopyClick} className="btn-copy"><FileCopyIcon /></Button></Box>) :
                    <label className="label-text">{ label }</label>
            }
            
            {onChange ? 
                <TextareaAutosize
                    className="input-textarea"
                    aria-label="maximum height" 
                    maxRows={30} 
                    minRows={30}
                    onChange={onChange}
                    value={value}
                    placeholder={placeholder}
                /> : 
                <TextareaAutosize
                    className="input-textarea"
                    aria-label="maximum height" 
                    maxRows={30} 
                    minRows={30}
                    defaultValue={value}
                    readOnly 
                    ref={inputRef}
                />
            }
        </Box>
    );
}
 
export default InputTextarea;
