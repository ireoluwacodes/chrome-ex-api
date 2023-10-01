import expressAsyncHandler from "express-async-handler";
import fs from "fs";
import amqp from "amqplib";
import path from "path";
import { Video } from "./model";

const Home = expressAsyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "Backend home page",
  });
});

const createVideo = expressAsyncHandler(async (req, res) => {
  try {
    const allVideos = await Video.find({});

    let name = `New Recording ${allVideos.length + 1}`;
    let path = `${__dirname}/videos/${name}.webm`;
    const newVideo = await Video.create({
      name,
      path,
    });
    return res.status(200).json({
      status: true,
      id: newVideo._id,
    });
  } catch (error) {
    throw new Error(error);
  }
});

const appendVideo = expressAsyncHandler(async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      res.status(400);
      throw new Error("invalid parameters");
    }
    const myVideo = await Video.findById(id);
    const dataBuffer = new Buffer(data, "base64");
    let path = myVideo.path;
    const fileStream = fs.createWriteStream(path, { flags: "a" });
    fileStream.write(dataBuffer);
    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const completeVideo = expressAsyncHandler(async (req, res) => {
  try {
     const {id} = req.body
     let myVideo = await Video.findById(id)
     let path = myVideo.path
     let video = fs.readFileSync(path, (err, data)=>{
      if(err){
        throw new Error(err)
      }
      return data
     })

     const queue = "video";
     let url = process.env.AMQPURL
     const details = {
      id,
      video
     }
     (async () => {
      let connection;
      try {
        connection = await amqp.connect(url);
        const channel = await connection.createChannel();
    
        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(details)));
        console.log(" [x] Sent '%s'", details);
        await channel.close();
      } catch (err) {
        console.warn(err);
      } finally {
        if (connection) await connection.close();
      }
    })();


    return res.status(200).json({
      status: true,
      message: "success",
    });
  } catch (error) {
    throw new Error(error)
  }
});

const getVideo = expressAsyncHandler(async (req, res) => {
try {
  const {id} = req.body
  const myVideo = await Video.findById(id)
  
  return res.status(200).json({
    status: true,
    message: "success",
  });
} catch (error) {
  throw new Error(error)
}
});

export { Home, createVideo, appendVideo, completeVideo, getVideo };
