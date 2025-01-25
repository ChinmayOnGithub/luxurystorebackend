import { DataModel } from "../models/data.model.js";
import { mongoose } from 'mongoose';


// no login required
const addNewPost = async (req, res) => {
  const { vlabel, vlink, postedby } = req.body;
  // console.log({ vlabel, vlink, postedby } )

  // find if the link already exists on the database 
  const prevData = await DataModel.findOne({ vlink });
  if (prevData) {
    return res.status(400).json({ message: "Provided link already exists" });
  } else {
    // link not found : create new data
    try {
      const newData = new DataModel({ vlabel, vlink, postedby });
      await newData.save();
      res.status(200).json({ message: 'Data added successfully', newData });
    } catch (error) {
      res.status(500).json({ message: 'Error adding data', error });
    }
  }
}


const getPost = async (req, res) => {
  try {
    const data = await DataModel.find(); // Retrieve all documents from the 'videodetail' collection
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
}


const searchData = async (req, res) => {
  const { vlabel } = req.query;

  if (!vlabel) {
    // console.warn("No 'vlabel' query provided.");
    return res.status(400).json({ message: 'vlabel query parameter is required' });
  }

  try {
    // console.log("Searching for:", vlabel);
    const data = await DataModel.find({ vlabel: { $regex: vlabel, $options: 'i' } });

    if (data.length === 0) {
      console.warn("No data found for query:", vlabel);
      return res.status(404).json({ message: 'Data not found' });
    }

    // console.log("Data found:", data);
    return res.status(200).json(data);
  } catch (error) {
    // console.error("Database error:", error);
    return res.status(500).json({ message: 'Error fetching data', error });
  }
};



export {
  addNewPost,
  getPost,
  searchData
}