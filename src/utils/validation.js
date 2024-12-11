// validation.js
const validateSignupData = (userObj) => {
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
      "emailId", // Added emailId to allowed fields
    ];
  
    // Validate request body structure
    if (!userObj || Object.keys(userObj).length === 0) {
      return { valid: false, error: { status: 400, message: "Request body cannot be empty" } };
    }
  
    // Check for invalid fields
    const invalidFields = Object.keys(userObj).filter(
      (key) => !allowedFields.includes(key)
    );
  
    if (invalidFields.length > 0) {
      return {
        valid: false,
        error: {
          status: 400,
          message: "Invalid fields in the request",
          invalidFields,
        },
      };
    }
  
    // Validate skills field if present
    if (userObj.skills) {
      if (!Array.isArray(userObj.skills)) {
        return { valid: false, error: { status: 400, message: "Skills must be an array of strings." } };
      }
      if (userObj.skills.some((skill) => typeof skill !== "string")) {
        return { valid: false, error: { status: 400, message: "Each skill in the array must be a string." } };
      }
      if (userObj.skills.length > 5) {
        return { valid: false, error: { status: 400, message: "You can only add up to 5 skills." } };
      }
    }
  
    return { valid: true };
  };
  
  module.exports = validateSignupData;
  