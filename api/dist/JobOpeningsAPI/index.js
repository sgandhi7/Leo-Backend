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
const fetchJobData = function (context) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const sasToken = process.env.AZURE_JOB_SAS_TOKEN;
        const url = 'https://jorgestorageblob.blob.core.windows.net/job-backslash/openings.json?' +
            sasToken;
        try {
            console.log('Fetching job openings from blob...');
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                },
            });
            const data = yield response.json();
            if (Array.isArray(data) &&
                data.every((item) => typeof item.title === 'string' &&
                    typeof item.company === 'string')) {
                const jobs = data;
                context.res = {
                    body: {
                        jobs,
                        titles: jobs.map((job) => job.title),
                        companies: jobs.map((job) => job.company), // extracted companies
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };
            }
            else {
                throw new Error('Job data format is incorrect');
            }
        }
        catch (error) {
            const statusCode = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
            context.res = {
                status: statusCode,
                body: `Failed to fetch job data: ${error.message}`,
            };
        }
    });
};
exports.default = fetchJobData;
//# sourceMappingURL=index.js.map