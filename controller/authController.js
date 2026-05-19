const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');
const {createUser, findUser} = require('../models/userModels');

const register = async ( req, res)=>{
    const {firstname, lastname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password){
        return res.status(400).json({message: 'All fields are required'});
    }
    
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = {
            firstname,
            lastname,
            email,
            password: hashedPassword
        };
        createUser(newUser,(err, result)=>{
            if (err) {
                if(err.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({message: "Email is already to exist, please try to login "});
                }
                return res.status(500).json({message: " database error:" + err})
            }
            const payload= {
                id: result.insertId,
                firstname,
                lastname,
                email,
    
            }
            const token = generateToken(payload, res);
            res.status(200).json({
                message : "register successful",    
                user : {
                    id: result.insertId,
                    firstname,
                    lastname,
                    email
                },
                token
            });
        });
        
    }catch(error){
        res.status(500).json({message : "error", err: error.message});
    }
};

const login = async ( req, res ) =>
{
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    
    try{
        findUser(email, async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'error', err: err.message });
            }
            
            if (result.length === 0) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            const user = result[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            
            const data = {
                id: user.id,
                email: user.email,
            };
            const token = generateToken(data, res);
            
            res.status(200).json({
                status : "login successfully",
                user : {
                    data
                },
                token,
            });
        });
    }catch(err){
        res.status(500).json({message : "error", err: err.message});
    }
};

const logout = async(req, res) =>{
    res.cookie("jwt", "" ,{
        httpOnly: true,
        expires : new Date(0)
    });
    
    res.status(200).json({
        status: "success",
        message: "logged out successfully"
    });
}

module.exports = {register, login , logout};