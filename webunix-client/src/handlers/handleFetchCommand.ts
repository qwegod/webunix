export const handleFetchCommands = (command: string): Promise<any> => {
    const options = {
      method: 'POST',
      body: JSON.stringify({ command }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    return fetch('http://localhost:3232/api/execute', options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          throw new Error('Response is not JSON');
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        throw error; 
      });
  };
  