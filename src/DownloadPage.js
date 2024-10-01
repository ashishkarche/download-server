import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DownloadPage = () => {
  const [token, setToken] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Function to extract the token from the URL
  const getUrlParameter = (name) => {
    const regex = new RegExp(`[?&]${name}=([^&#]*)`, 'i');
    const results = regex.exec(window.location.search);
    return results ? decodeURIComponent(results[1]) : '';
  };

  useEffect(() => {
    const tokenFromUrl = getUrlParameter('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);

      // Check the token validity by making an API call
      axios
        .post('https://server-two-self-13.vercel.app/check-token', { token: tokenFromUrl })
        .then((response) => {
          if (response.data.success) {
            // If token is valid, proceed to check for expiration
            checkLinkExpiry(tokenFromUrl);
          } else {
            // Token validation failed
            setIsValidToken(false);
            setErrorMessage('Link is expired.'); // Set the expired link message
            closeWindow(); // Close the window after displaying the message
          }
        })
        .catch((error) => {
          console.error('Error: ', error);
          setIsValidToken(false);
          setErrorMessage('An error occurred while validating the token.');
          closeWindow(); // Close the window after displaying the message
        });
    } else {
      // If no token is present in the URL, display an error message
      setIsValidToken(false);
      setErrorMessage('Token is missing from the URL.');
    }
  }, []);

  const checkLinkExpiry = (token) => {
    // Check for link expiry
    axios
      .get(`https://server-two-self-13.vercel.app/download?token=${token}`)
      .then((response) => {
        if (response.status === 403) {
          // Link has expired
          setIsValidToken(false);
          setErrorMessage('Link is expired.'); // Set the expired link message
          closeWindow(); // Close the window after displaying the message
        } else if (response.status === 200) {
          // If valid and not expired, proceed to download
          window.location.href = response.request.responseURL; // Navigate to download URL
        }
      })
      .catch((error) => {
        console.error('Error checking link expiry:', error);
        setIsValidToken(false);
        setErrorMessage('An error occurred while checking link expiry.');
        closeWindow(); // Close the window after displaying the message
      });
  };

  // Function to close the window after showing the message
  const closeWindow = () => {
    setTimeout(() => {
      window.close();
    }, 5000); // Keep the window open for 5 seconds so the user can see the message
  };

  return (
    <div>
      <h1>File Download Page</h1>
      {token === '' && <p>Token is missing from the URL.</p>}
      {token && isValidToken === null && <p>Validating token...</p>}
      {isValidToken === false && <p>{errorMessage}</p>} {/* Show error message */}
    </div>
  );
};

export default DownloadPage;
