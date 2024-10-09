"use strict";
// Custom error handler
const constants = require("../../config/constants");

module.exports.ErrorHandler = (error) => {
  console.log("error", "error in custom handler is");
  let errRes = error;
  if (error) {
    /*if(error.code && constants.postgressErrorCodes.includes(error.code)){
            errRes = `Data error! Contact support. Code - ${error.code}`
        }else if (error.toString().includes ('Undefined binding(s)') || error.toString().includes('Undefined column(s)')){
            errRes = 'Query error'
        }
        else */ if (error.isJoi) {
      errRes = error.details
        .map((d) => d.message)
        .join(", ")
        .replace(/"/g, "");
    } else if (error instanceof Error && typeof error === "object") {
      try {
        errRes = error.message;
      } catch (e) {
        errRes = undefined;
      }
    } else if (typeof error === "string" || error instanceof String) {
      errRes = error;
    }
  }
  return errRes;
};
