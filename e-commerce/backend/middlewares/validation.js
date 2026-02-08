import { ApiResponse } from "../utils/apiResponse.js";


export const validateRequest = (schema) => (req, res, next) => {
    try {
        const {error} = schema.validate(req.body, {abortEarly:false});
        if(error){
            const errors = error.details.map(detail => ({
                field:detail.path.join('.'),
                message:detail.message
            }))
            return res.status(400).json(ApiResponse.error("Validation Failed" , errors))
        }
        next();
    } catch (error) {
        res.status(500).json(ApiResponse.error("Validation Error"))
    }
};

export const validateParams = (paramName , validator) => (req, res , next) => {
 const value = req.params[paramName];
 if(!value || !validator(value)){
    return res.status(400).json(
        ApiResponse.error(`invalid ${paramName} : ${value}`)
    )
 }
 next();
}
