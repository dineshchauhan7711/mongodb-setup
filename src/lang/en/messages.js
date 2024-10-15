const MESSAGES = {

    // User Authentication
    '1001': 'Register successfully.',
    '1002': 'Sign in successfully.',
    '1003': 'Get profile successfully.',
    '1004': 'Already registered with this email!',
    '1005': 'Please enter correct email and password.',
    '1006': 'Logout successfully.',
    '1007': 'User not found!',
    '1008': 'Profile updated successfully!',
    '1009': 'Please enter correct password.',
    '1010': 'Unauthorized Users.',
    '1011': 'Error while sending email.',
    '1012': 'Email sent successfully. Please check your email.',
    '1013': 'Please enter correct OTP.',
    '1014': 'Link expired. Please try again.',
    '1015': 'Link verified successfully.',
    '1016': 'Password changed successfully.',
    '1017': "Account deleted successfully.",
    '1018': 'Your account is deactivated. Please contact to admin.',
    '1019': 'Profile updated successfully.',
    '1020': 'Error while generating forgot password link.',
    '1021': 'Error while uploading file.',


    // Common
    '9000': 'Please Enter Valid data!',
    '9001': 'Not found.',
    '9999': 'Something went wrong!',

}

module.exports.getMessage = function (messageCode) {
    if (isNaN(messageCode)) {
        return messageCode;
    }
    return messageCode ? MESSAGES[messageCode] : '';
};
