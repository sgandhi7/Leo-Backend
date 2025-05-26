"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const fetchEmployeeData = function (context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // SAS token for authenticated access to the Azure Blob Storage
        const sasToken = process.env.AZURE_SAS_TOKEN;
        // URL of the JSON file in Azure Blob Storage, including SAS token
        const url = 'https://jorgestorageblob.blob.core.windows.net/people/people.json?' +
            sasToken;
        try {
            console.log('Start of azure function');
            // Fetch data from the specified URL using GET method
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            // Parse the response as JSON
            const data = yield response.json();
            // Runtime type check to ensure 'data' is an array of Employee objects
            /* Expected structure of data:
               [
                {
                  "mss_name": "test1",
                  "mss_workemail": "test1@domain.com",
                  "mss_number": 0,
                  "mss_bamboohrid": "0"
                },
                ...
               ]
            */
            if (Array.isArray(data) &&
                data.every((item) => typeof item.mss_name === 'string' &&
                    (typeof item.mss_workemail === 'string' ||
                        item.mss_workemail === null) &&
                    typeof item.mss_number === 'number' &&
                    (typeof item.mss_bamboohrid === 'string' ||
                        item.mss_bamboohrid === null))) {
                // Safely assert that 'data' is of type Employee[]
                const employees = data;
                // Prepare the response object with structured data
                context.res = {
                    body: {
                        jsonData: data,
                        names: employees.map((item) => item.mss_name),
                        emails: employees.map((item) => item.mss_workemail || 'N/A'), // Extract emails, fallback to 'N/A'
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            }
            else {
                // Throw an error if data format is incorrect
                throw new Error('Data format is incorrect');
            }
        }
        catch (error) {
            // Handle errors, set response status and error message
            const statusCode = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500; // Default to 500 if no status code
            context.res = {
                status: statusCode,
                body: `Failed to fetch employee data: ${error.message}`, // Error message
            };
        }
    });
};
exports.default = fetchEmployeeData;
//# sourceMappingURL=index.js.map