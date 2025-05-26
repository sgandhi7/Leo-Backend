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
const msal_node_1 = require("@azure/msal-node");
const getProfileOnBehalfOf = function (context, req) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const tenantId = process.env.REACT_APP_AZURE_TENANT_ID;
        const clientId = process.env.REACT_APP_AZURE_CLIENT_ID;
        const clientSecret = process.env.REACT_APP_AZURE_CLIENT_SECRET;
        const token = (_a = req.body) === null || _a === void 0 ? void 0 : _a.token;
        if (!tenantId || !clientId || !clientSecret || !token) {
            context.res = {
                status: 400,
                body: 'Missing required parameters.',
            };
            return;
        }
        const msalConfig = {
            auth: {
                clientId: clientId,
                clientSecret: clientSecret,
                authority: `https://login.microsoftonline.com/${tenantId}`,
            },
        };
        const msalClient = new msal_node_1.ConfidentialClientApplication(msalConfig);
        try {
            const result = yield msalClient.acquireTokenOnBehalfOf({
                oboAssertion: token,
                scopes: ['https://graph.microsoft.com/User.Read'],
                skipCache: true,
            });
            context.res = {
                status: 200,
                body: {
                    accessToken: result.accessToken,
                },
            };
        }
        catch (error) {
            context.log('Error during token exchange:', error);
            context.res = {
                status: 500,
                body: {
                    error: 'Token exchange failed',
                    details: error.message,
                },
            };
        }
    });
};
exports.default = getProfileOnBehalfOf;
//# sourceMappingURL=index.js.map