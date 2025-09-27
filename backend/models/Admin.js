const bcrypt = require('bcryptjs');

module.exports = (mongoose) => {
    const adminSchema = new mongoose.Schema({
        // admin email
        email: {
            type: String,
            required: true,
            unique: true,
            validate: {
                validator: function(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                },
                message: 'Please provide a valid email address'
            }
        },

        // password
        password: {
            type: String,
            required: true
        }
    }, {
        timestamps: true
    });

    // store procedure
    adminSchema.pre('save', async function(next) {
        if(!this.isModified('password')) return next();

        try {
            const salt = await bcrypt.genSalt(14);
            this.password = await bcrypt.hash(this.password, salt);
            next();
        } catch (error) {
            next(error);   
        }
    });

    // compare password
    adminSchema.methods.comparePassword = async function(candidatePassword) {
        try {
            return await bcrypt.compare(candidatePassword, this.password);
        } catch (error) {
            throw error;
        }
    };

    return mongoose.model('Admin', adminSchema);
};