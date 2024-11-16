export const handleFetchCommands = (url: string, req?: Object): Promise<any> => {
  const options = {
    method: "POST",
    body: JSON.stringify(req),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  };

  return fetch(url, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      } else {
        throw new Error("Response is not JSON");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      throw error;
    });
};
