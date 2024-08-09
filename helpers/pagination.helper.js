module.exports = (query, objectPagination, countPage) => {
    objectPagination.total = Math.ceil(countPage/objectPagination.limit);

    if(query.page) {
        objectPagination.page = parseInt(query.page);
        objectPagination.skip = (objectPagination.page - 1) * objectPagination.limit;
    }
    return objectPagination;
}