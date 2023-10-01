import { app, connectDB } from "./config.js";

const PORT = process.env.PORT;

const startApp = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
};

startApp();

export default app
