import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadPage = () => {
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);

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
            // Initiate the download
            window.location.href = `https://server-two-self-13.vercel.app/download?token=${tokenFromUrl}`;
            // Wait for a short duration to allow the download to start, then close the window
            setTimeout(() => {
              window.close();
            }, 2000); // Adjust the timeout as necessary
          } else {
            setIsValidToken(false);
          }
        })
        .catch((error) => {
          console.error('Error: ', error);
          setIsValidToken(false);
        });
    }
  }, []);

  return (
    <div>
      <h1>File Download Page</h1>
      {token === '' && <p>Token is missing from the URL.</p>}
      {token && isValidToken === null && <p>Validating token...</p>}
      {isValidToken === false && <p>Token is not valid.</p>}
    </div>
  );
};

export default DownloadPage;
