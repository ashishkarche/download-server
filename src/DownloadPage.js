import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadPage = () => {
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const getUrlParameter = (name) => {
    const regex = new RegExp(`[?&]${name}=([^&#]*)`, 'i');
    const results = regex.exec(window.location.search);
    return results ? decodeURIComponent(results[1]) : '';
  };

  useEffect(() => {
    const tokenFromUrl = getUrlParameter('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      axios
        .get(`https://server-two-self-13.vercel.app/download?token=${tokenFromUrl}`)
        .then((response) => {
          // Handle valid download
          if (response.status === 200) {
            setIsValidToken(true);
            // Proceed with download, browser will automatically handle it
          }
        })
        .catch((error) => {
          // Handle expired token or other errors
          if (error.response && error.response.status === 403) {
            setErrorMessage('Link is expired.');
            setIsValidToken(false);
            // Close the window after 3 seconds
            setTimeout(() => {
              window.close();
            }, 3000);
          } else {
            setErrorMessage('An error occurred. Please try again later.');
            setIsValidToken(false);
          }
        });
    }
  }, []);

  return (
    <div>
      <h1>File Download Page</h1>
      {token === '' && <p>Token is missing from the URL.</p>}
      {token && isValidToken === null && <p>Validating token...</p>}
      {isValidToken === false && <p>{errorMessage}</p>}
    </div>
  );
};

export default DownloadPage;
