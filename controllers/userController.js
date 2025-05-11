export const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Validate user credentials
        if (!username || !password) {
            return res.status(400).json({ message: 'username and password are required' });
        }
        else if (username === 'admin' && password === '123') {
            return res.status(200).json({ message: 'Login successful' });
        }
        else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
