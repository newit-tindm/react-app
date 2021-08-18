import React from 'react';
import Box from '@material-ui/core/Box';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import './style.css';
import { ProgressLoading } from './progress.jsx';
import FetchButton from './fetchButton';

const InputTextarea = ({ 
    label,
    isLoading,
    placeholder,
    value,
    onChange,
    btnClick,
}) => {
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
                </Box> :
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
                />
            }
        </Box>
    );
}
 
export default InputTextarea;
