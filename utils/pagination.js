export const pagination = (req)=>{
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50)
    const skip = (page - 1) * limit
    return{page, limit, skip}

}