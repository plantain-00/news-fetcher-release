"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const key = process.env.NEWS_FETCHER_KEY;
exports.items = [];
let rawSources;
function assert(condition, statusCode, errorMessage) {
    if (!condition) {
        throw [statusCode, errorMessage];
    }
}
async function bind(app, method, path, handler, upload) {
    async function handle(request, response) {
        try {
            assert(request.query.key === key, 403, "a key is required");
            await handler(request, response);
        }
        catch (error) {
            response.status(error[0]).json({
                isSuccess: false,
                errorMessage: error[1],
            });
        }
    }
    if (upload) {
        app[method](path, upload.any(), handle);
    }
    else {
        app[method](path, handle);
    }
}
exports.bind = bind;
async function getHistory(request, response) {
    const date = Date.now() - 7 * 24 * 3600 * 1000;
    exports.items = exports.items.filter(item => item.createTime > date);
    response.status(200).json({
        isSuccess: true,
        items: exports.items.map(i => i.url),
        rawSources,
    });
}
exports.getHistory = getHistory;
async function saveHistory(request, response) {
    exports.items.push({
        createTime: Date.now(),
        url: request.body.url,
    });
    response.status(200).json({
        isSuccess: true,
    });
}
exports.saveHistory = saveHistory;
async function saveRawSources(request, response) {
    const newRawSources = request.body.rawSources;
    assert(newRawSources, 400, "rawSources is required in body");
    rawSources = newRawSources;
    response.status(200).json({
        isSuccess: true,
    });
}
exports.saveRawSources = saveRawSources;
async function errorReport(request, response) {
    // here is error report in response.body, response.file and response.files
    response.status(200).json({
        isSuccess: true,
    });
}
exports.errorReport = errorReport;
