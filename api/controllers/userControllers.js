const testUser = async (req, res) => {
  
  try {
    res.status(200).json({name: "alpaca", mail: "alpaca@gmail.com"})
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(`Error in getUserProfile: ${err.message}`);
  }
};


export { testUser };