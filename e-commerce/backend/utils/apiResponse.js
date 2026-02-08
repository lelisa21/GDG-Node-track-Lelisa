export class ApiResponse{
    static success(data , message = "Success") {
        return {
            success:true,
            message,
            data
        }
    };

static error(message="Error" , errors = null){
    return{
        success:false,
        message,
        errors
    }
}
static paginated(data, page, limit, total){
    return{
        success:true,
        data,
        pagination:{
            page:parseInt(page),
            limit:parseInt(limit),
            total,
            pages:Math.ceil(total/limit),
            hasNext:page*limit < total,
            hasPrev:page > 1
        }
    }
}
}
