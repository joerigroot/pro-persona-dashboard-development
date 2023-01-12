const isPresent = async ({ record }) => {
    console.log('RECORD: ' + record);
    console.log('RECORD DATA: ' + record.data);
    if (record && !record.data) {
        return {
            as: false,
        };
    }
    const result = record.data ? true : false;
    return {
        as: result,
    };
};
export default isPresent;
