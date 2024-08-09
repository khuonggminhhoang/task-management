module.exports = (query) => {
    const object = {}; 
    if(query.keyword) {
        object.target = query.keyword;
        object.regex = RegExp(object.target, 'i'); 
    }
    return object;
}