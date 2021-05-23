const iterateTodos = todos => {
    let newData = todos.reduce((acc, todo) => {
        let key = todo._id;
        acc[key] = todo["data"];
        return acc;
    }, {});
    return newData;
};

module.exports = {
    iterateTodos
};