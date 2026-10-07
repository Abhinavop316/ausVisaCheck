exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        const envUsername = process.env.ADMIN_USERNAME || "admin";
        const envPassword = process.env.ADMIN_PASSWORD || "adminpassword123";

        if (username.trim() === envUsername.trim() && password === envPassword) {
            return res.status(200).json({
                success: true,
                message: "Admin authentication successful",
                token: "admin-session-authenticated-token"
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid admin credentials. Access denied."
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
