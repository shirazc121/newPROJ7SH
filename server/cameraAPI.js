
const express = require("express");

const { databaseConnection } = require("./connectionDB.js"); // Import your database connection object

const cameraRouter = express.Router();


///GET///
cameraRouter.get("/api/cameras", async (req, res) => {
  

  const getCameraQuery = "SELECT * FROM cameras ";
  let result;

  try {
    result = await databaseConnection.query(getCameraQuery);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  res.json(result);
});

cameraRouter.get("/api/camera/:ID", async (req, res) => {
  let cameraID = parseInt(req.params.ID);

  const getCameraQuery = "SELECT * FROM cameras WHERE ID = ?";
  let result;
  
  try {
    result = await databaseConnection.query(getCameraQuery, [cameraID]);
    console.log(result);
    //console.log(result[0]);
    
  } catch (error) {
    console.error("Error fetching camera access:", error);
    res.status(400).send(JSON.stringify("An error occurred while fetching camera access"));
    
  }
  res.json(result);
});

///DELETE/// 
cameraRouter.delete("/api/cameras/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  

  const deletCamQuery = "DELETE FROM cameraAccess WHERE userID = ? ";
  let deleteCamResult;

  try {
    deleteCamResult = await databaseConnection.query(deletCamQuery, [id]);
    console.log(deleteCamResult);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }
  const getCamQuery = "SELECT * FROM cameras WHERE ID = ? ";
  let deleteCamera;
  let selectResults;

  try {
    selectResults = await databaseConnection.query(getCamQuery, [id]);
    console.log(selectResults);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }
  deleteCamera= selectResults[0];

  const deletCameraQuery = "DELETE FROM cameras WHERE ID = ? ";
  let deleteCameraResult;
  try {
    deleteCameraResult = await databaseConnection.query(deletCameraQuery, [id]);
    console.log(deleteCameraResult);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }
  
  res.json(deleteCamera);


});

///PUT///
cameraRouter.put("/api/cameras/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { location, junction ,video } = req.body;

  let sql = `UPDATE cameras SET`;
  const values = [];

  if (location !== undefined) {
    sql += ` location = ?,`;
    values.push(location);
  }

  if (junction !== undefined) {
    sql += ` junction = ?,`;
    values.push(junction);
  }
  if (video !== undefined) {
    sql += ` video = ?,`;
    values.push(video);
  }
  // Remove the trailing comma from the SQL statement
  sql = sql.slice(0, -1);

  sql += ` WHERE ID = ?`;
  values.push(id);

  // Execute the SQL update query
  try {
    await databaseConnection.query(sql, values);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  // Fetch the updated user data after the update
  const getCameraQuery = "SELECT * FROM cameras WHERE ID = ?";
  let result;

  try {
    result = await databaseConnection.query(getCameraQuery, [id]);
    console.log(result);
  } catch (e) {
    res.status(400).send(JSON.stringify("error"));
    return;
  }

  res.json(result[0]);

});

// POST request to create a new camera
// cameraRouter.post("/cameras", (req, res) => {
//   const { location, junction, video } = req.body;
//   const query =
//     "INSERT INTO cameras (location, junction, video) VALUES (?, ?, ?)";

//   databaseConnection.query(
//     query,
//     [location, junction, video],
//     (error, results) => {
//       if (error) {
//         res
//           .status(500)
//           .json({ error: "An error occurred while creating a camera." });
//       } else {
//         res.json({
//           message: "Camera created successfully.",
//           cameraId: results.insertId,
//         });
//       }
//     }
//   );
// });

// PUT request to update camera details
// cameraRouter.put("/cameras/:id", (req, res) => {
//   const cameraId = req.params.id;
//   const { location, junction, video } = req.body;
//   const query =
//     "UPDATE cameras SET location = ?, junction = ?, video = ? WHERE ID = ?";

//   databaseConnection.query(
//     query,
//     [location, junction, video, cameraId],
//     (error, results) => {
//       if (error) {
//         res
//           .status(500)
//           .json({ error: "An error occurred while updating the camera." });
//       } else {
//         res.json({ message: "Camera updated successfully." });
//       }
//     }
//   );
// });

// DELETE request to delete a camera
// cameraRouter.delete("/cameras/:id", (req, res) => {
//   const cameraId = req.params.id;
//   const query = "DELETE FROM cameras WHERE ID = ?";

//   databaseConnection.query(query, [cameraId], (error, results) => {
//     if (error) {
//       res
//         .status(500)
//         .json({ error: "An error occurred while deleting the camera." });
//     } else {
//       res.json({ message: "Camera deleted successfully." });
//     }
//   });
// });

module.exports = cameraRouter;



