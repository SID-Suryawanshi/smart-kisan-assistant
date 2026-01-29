const Kisan = require("../models/Kisan");

exports.signup = async (req, res) => {
  console.log("Request Body : ", req.body);
  try {
    const kisan = new Kisan(req.body);
    await kisan.save();

    res.status(201).json({
      message: "Kisan registered successfully",
      data: Kisan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const kisan = await Kisan.findOne({ email });

    if (!kisan) {
      return res.status(404).json({
        message: "Kisan not found",
      });
    }

    if (kisan.password !== password) {
      return res.status(404).json({
        message: "Invalid password",
      });
    }

    res.json({
      message: "Login successful",
      Role: "kisan",
      kisanId: kisan._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  const kisanId = req.params.id;

  try {
    const kisan = await Kisan.findById(kisanId).select("-password");

    if (!kisan) {
      return res.status(404).json({
        message: "Kisan not found",
      });
    }

    res.json(kisan);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

exports.updateProfile = async (req, res) => {
  const kisanId = req.params.id;

  try {
    const kisan = await Kisan.findById(kisanId).select("-password");

    if (!kisan) {
      return res.status(404).json({
        message: "Kisan not found",
      });
    }

    kisan.name = req.body.name || kisan.name;
    kisan.phone = req.body.phone || kisan.phone;
    kisan.address = req.body.address || kisan.address;

    await kisan.save();

    res.status(200).json({
      message: "Profile updated successfully",
      kisan,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
