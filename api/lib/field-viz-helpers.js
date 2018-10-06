const onlyVisibleToAdmins = (state) => state.authUser.type === 'admin';

const passwordProtectedField = (state) => state.passwordValidated;

module.exports = {
  onlyVisibleToAdmins,
  passwordProtectedField,
};
