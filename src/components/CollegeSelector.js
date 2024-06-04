import React, { useState, useEffect, useMemo } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import _ from 'lodash';
import CollegeInfo from './CollegeInfo';

const CollegeSelector = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  // fetching college details
  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json');
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchColleges = useMemo(() => _.debounce(fetchColleges, 300), []);

  useEffect(() => {
    debouncedFetchColleges();
    return () => {
      debouncedFetchColleges.cancel();
    };
  }, [debouncedFetchColleges]);

  // fetching college logo 
  const handleCollegeChange = async (event, value) => {
    setSelectedCollege(value);
    setLogoUrl('');
    if (value) {
      const domain = value.domains[0];
      const logoUrl = `https://logo.clearbit.com/${domain}`;
      try {
        const response = await axios.get(logoUrl);
        if (response.status === 200) {
          setLogoUrl(logoUrl);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    }
  };

  return (
    <div>
      <Autocomplete
        options={colleges}
        getOptionLabel={(option) => option.name}
        onChange={handleCollegeChange}
        renderOption={(props, option, { index }) => (
          <li {...props} key={index}>
            {option.name}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a College"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {selectedCollege && <CollegeInfo selectedCollege={selectedCollege} logoUrl={logoUrl} loading={loading} />}
    </div>
  );
};

export default CollegeSelector;
