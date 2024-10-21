const User = require("../models/user");
const jwt = require('jsonwebtoken');

module.exports = {
    index: (req, res) => {
        res.render('./index')
    },
    
    get_login: (req, res) => {
        res.render('./login')
    },

    login: async(req, res) =>{
        const { schReg_no, password }= req.body;

        const schReg_noReg = /^\d{4}\/[a-zA-Z]{2}\/\d+$/;
        const passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+\[\]{}|;:,.<>?]).{8,}$/;

        try {
            if (!schReg_noReg.test(schReg_no)) {
                throw new Error('Incorrect Registration Number')
            }

            if (!passwordReg.test(password)) {
                throw new Error('Incorrect password')
            }

            // invoke the static login method
            const isLoggedIn = await User.login(schReg_no, password)
            // console.log(isLoggedIn)

            if (isLoggedIn) {
                // Generate JWT token
                const token = jwt.sign({id: isLoggedIn._id, role: isLoggedIn.role}, process.env.SECRET,
                    {expiresIn: 4000 * 60 * 60 * 24}
                )
                
                // console.log(token);
                // send JWT to cookie
                res.cookie('jwt', token, {maxAge: 4000 * 60 * 60 * 24}); 

                let redirectURL = '';
                if (isLoggedIn.role === 'student') {
                    redirectURL = '/student/dashboard';
                } else if (isLoggedIn.role === 'lecturer') {
                    redirectURL = '/lecturer/dashboard'; 
                }

                return res.status(200).json({
                    success: true, 
                    msg:'Login Successfully',
                    redirectURL : redirectURL,
                    user: isLoggedIn
                });
            }else{
                throw new Error('Invalid Credentials');
            }
        } catch (error) {
            return res.status(401).json({error: error.message})
        }
    },
}