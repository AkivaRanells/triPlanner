/**
 * @class responsible for clientside ajax calls
 */

class AjaxUtil {
    constructor() {

    }

    getAjax(method, url, data, dataType) {
        const req = {};
        req.method = method;
        req.url = url;
        if (data) { req.data = data; }
        if (dataType) { req.dataType = dataType; }

        return $.ajax(req);
    }
}

export default AjaxUtil