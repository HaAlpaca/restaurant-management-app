

// const check = async (models, modelScheme, res) => {
//   for (const model of models) {
//     if (!mongoose.Types.ObjectId.isValid(model)) {
//       return res
//         .status(400)
//         .json({ message: `Invalid reservation ID: ${model}` });
//     }

//     const ans = await modelScheme.findById(model);
//     if (!ans) {
//       return res.status(404).json({
//         message: `Reservation with ID: ${model} not found`,
//       });
//     }
//   }
// };

const createTable = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getTableById = async (req, res) => {
  try {
    
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const getAllTable = async (req, res) => {
  try {

  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const deleteTableById = async (req, res) => {
  try {
    
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

const updateTableById = async (req, res) => {
  try {
    
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
export {
  createTable,
  deleteTableById,
  getTableById,
  getAllTable,
  updateTableById,
};
