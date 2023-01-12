import SUT from '../../modules/SUT';
const createSut = async ({ sutInput, userName, expiresIn, secret, }) => {
    const sut = SUT.create(secret, userName, expiresIn, sutInput || {});
    return { response: sut };
};
export default createSut;
