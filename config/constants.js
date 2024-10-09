"use strict";

const constants = Object.freeze({
   
    error: {        
        server: {
            notFound: "Server not found",
            serverIdInteger :"Server ID must be an integer.",
            searchKeywordRequired :"Search server keyword is required.",
            partNumberNotMatched : "Part Number not matched"

        },
        auth:{
            emailTaken:"email is already taken",
            invalidCredentials: "Invalid Credentials",
        },
        part: {
            notFound: "Part not found",
            partIdInteger :"Part ID must be an integer.",
            searchKeywordRequired :"Search part keyword is required.",
            partNumberRequired :"Part number is required.",
            sku:"Sku not found",
            notEncoded:"Part is not Encoded"
        },
        serverparts: {            
            serverpartsNotFound: "Server parts not found.",           
        },
        multer: {
            invalidFile: "Please upload only csv file."
        },
        processor:{
            notFound:'Processor not found'
        },
        gpu:{
            notFound:'Gpu not found'
        },
        auditlog:{
            notFound:'auditlog not found'
        }
    },
  
    activeStatus: {
        active: "active",
        inactive: "inactive",
        deleted: "deleted",
        hidden: "hidden",
        cancelled: 'cancelled',
        pending: "pending"
    },
    
    
    postgressErrorCodes: [
        "42000", //SYNTAX ERROR OR ACCESS RULE VIOLATION
        "42601", //SYNTAX ERROR
        "42501", //INSUFFICIENT PRIVILEGE
        "42846", //CANNOT COERCE
        "42803", //GROUPING ERROR
        "42830", //INVALID FOREIGN KEY
        "42602", //INVALID NAME
        "42622", //NAME TOO LONG
        "42939", //RESERVED NAME
        "42804", //DATATYPE MISMATCH
        "42P18", //INDETERMINATE DATATYPE
        "42809", //WRONG OBJECT TYPE
        "42703", //UNDEFINED COLUMN
        "42883", //UNDEFINED FUNCTION
        "42P01", //UNDEFINED TABLE
        "42P02", //UNDEFINED PARAMETER
        "42704", //UNDEFINED OBJECT
        "42701", //DUPLICATE COLUMN
        "42P03", //DUPLICATE CURSOR
        "42P04", //DUPLICATE DATABASE
        "42723", //DUPLICATE FUNCTION
        "42P05", //DUPLICATE PREPARED STATEMENT
        "42P06", //DUPLICATE SCHEMA
        "42P07", //DUPLICATE TABLE
        "42712", //DUPLICATE ALIAS
        "42710", //DUPLICATE OBJECT
        "42702", //AMBIGUOUS COLUMN
        "42725", //AMBIGUOUS FUNCTION
        "42P08", //AMBIGUOUS PARAMETER
        "42P09", //AMBIGUOUS ALIAS
        "42P10", //INVALID COLUMN REFERENCE
        "42611", //INVALID COLUMN DEFINITION
        "42P11", //INVALID CURSOR DEFINITION
        "42P12", //INVALID DATABASE DEFINITION
        "42P13", //INVALID FUNCTION DEFINITION
        "42P14", //INVALID PREPARED STATEMENT DEFINITION
        "42P15", //INVALID SCHEMA DEFINITION
        "42P16", //INVALID TABLE DEFINITION
        "42P17", //INVALID OBJECT DEFINITION
    ]    ,
    categoryTypes : [
        "ssd",
        "hdd",
        "memory"
    ]
});

module.exports = constants;