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
const PromptFlowAPI = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = 'https://mss-leo-prod-vcqoi.eastus.inference.ml.azure.com/score';
        const apiKey = process.env.PROMPT_FLOW_API_KEY;
        if (!apiKey) {
            throw new Error('A key should be provided to invoke the endpoint');
        }
        try {
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                    'azureml-model-deployment': 'mss-leo-prod-vcqoi-1',
                },
                body: JSON.stringify(req.body),
            });
            const responseBody = yield response.json();
            context.res = {
                status: response.status,
                body: responseBody,
            };
        }
        catch (error) {
            context.log.error(`Error calling the API: ${error.message}`);
            context.res = {
                status: 500,
                body: 'Internal server error',
            };
        }
    });
};
exports.default = PromptFlowAPI;
//# sourceMappingURL=index.js.map