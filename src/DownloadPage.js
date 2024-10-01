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
        .post('https://server-two-self-13.vercel.app/check-token', { token: tokenFromUrl })
        .then((response) => {
          if (response.data.success) {
            setIsValidToken(true);
            // Initiate the download after confirming token validity
            window.location.href = `https://server-two-self-13.vercel.app/download?token=${tokenFromUrl}`;
          } else {
            setIsValidToken(false);
            setErrorMessage('Link is expired or invalid.');
          }
        })
        .catch((error) => {
          console.error('Error: ', error);
          setIsValidToken(false);
          setErrorMessage('An error occurred while validating the token.');
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
