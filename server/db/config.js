const mongoose = require("mongoose");
mongoose.set("strictQuery", true);


mongoose.connect(
  "mongodb+srv://shikha2803:shikha2803@cluster0.ecrva1l.mongodb.net/blogging?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
  }
);


mongoose.connection.on("error", (err) => {
  console.log("Connection failed");
});
mongoose.connection.on("connected", (connected) => {
  console.log("Connected with database");
});

