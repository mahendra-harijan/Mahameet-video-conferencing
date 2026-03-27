const server =
    process.env.REACT_APP_BACKEND_URL ||
    (process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:8000");

export default server;