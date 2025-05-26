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
// import {
//   ContainerClient,
//   StorageSharedKeyCredential,
// } from '@azure/storage-blob';
// const AZURE_ACCOUNT_NAME = 'mssleoblobs';
// const AZURE_STORAGE_KEY =
//   process.env.AZURE_STORAGE_KEY;
// // const blobServiceClient = BlobServiceClient.fromConnectionString(
// //   AZURE_STORAGE_CONNECTION_STRING,
// // );
// const sharedKeyCredential = new StorageSharedKeyCredential(
//   AZURE_ACCOUNT_NAME,
//   AZURE_STORAGE_KEY,
// );
// const baseUrl = `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net`;
// const containerName = 'leo-user-sessions';
// // create container from ContainerClient
// const containerClient = new ContainerClient(
//   `${baseUrl}/${containerName}`,
//   sharedKeyCredential,
// );
// // const containerClient =
// //   blobServiceClient.getContainerClient('leo-user-sessions');
// const uploadSession = async (user, session) => {
//   const blockBlobClient = containerClient.getBlockBlobClient(`${user}.json`);
//   const data = JSON.stringify(session);
//   await blockBlobClient.upload(data, data.length);
// };
// const downloadSession = async (user: string): Promise<JSON> => {
//   const blockBlobClient = containerClient.getBlockBlobClient(`${user}.json`);
//   const downloadBlockBlobResponse = await blockBlobClient.download(0);
//   const downloaded = await streamToString(
//     downloadBlockBlobResponse.readableStreamBody,
//   );
//   return JSON.parse(downloaded);
// };
// const streamToString = async (
//   readableStream: NodeJS.ReadableStream,
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     readableStream.on('data', (data) => {
//       chunks.push(data.toString());
//     });
//     readableStream.on('end', () => {
//       resolve(chunks.join(''));
//     });
//     readableStream.on('error', reject);
//   });
// };
const fetchSessions = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        // const user = req.body.user;
        // const action = req.query.action;
        // const session = req.query.session;
        // if (!user || !action) {
        //   context.res = {
        //     status: 400,
        //     body: 'Please provide user and action (upload/pull)',
        //   };
        //   return;
        // }
        // if (action === 'upload' && session) {
        //   await uploadSession(user, session);
        //   context.res = {
        //     status: 200,
        //     body: 'Session uploaded successfully',
        //   };
        // } else if (action === 'pull') {
        //   const sessionData = await downloadSession(user);
        //   context.res = {
        //     status: 200,
        //     body: sessionData,
        //   };
        // } else {
        //   context.res = {
        //     status: 400,
        //     body: 'Invalid action or missing data for upload',
        //   };
        // }
        const url = 'https://mssresumesync.azurewebsites.net/api/FetchSessions?code=IC9wV523JeN6HqISa6wyD4vVzhre7gWw4YbZ-g3dzD-sAzFu25dVAg%3D%3D';
        try {
            const response = yield (0, node_fetch_1.default)(url, {
                method: 'POST',
                //added line
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body),
            });
            // const responseBody = await response.json();
            //added lines for function to work
            const contentType = response.headers.get('content-type');
            const responseBody = (contentType === null || contentType === void 0 ? void 0 : contentType.includes('application/json'))
                ? yield response.json()
                : yield response.text(); // handle non-JSON responses safely
            context.res = {
                status: response.status,
                body: responseBody,
            };
        }
        catch (error) {
            context.log.error(`Error calling the API: ${error.message}`);
            context.res = {
                status: 500,
                body: { message: 'Internal server error', error: error.message },
            };
        }
    });
};
exports.default = fetchSessions;
//# sourceMappingURL=index.js.map