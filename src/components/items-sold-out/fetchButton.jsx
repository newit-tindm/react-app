import React from 'react';
import Button from '@material-ui/core/Button';
import './style.css';

const fetchButton = ({
    onClick,
    isLoading,
    disabled,
}) => {
    return (
        <Button 
            className="btn-fetch" 
            variant="contained" 
            onClick={onClick} 
            disabled={disabled ? disabled : isLoading}
        >
            Fetch
        </Button>
    );
}
 
export default fetchButton;