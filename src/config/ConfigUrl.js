export const MEMO_SERVICE_BASE = process.env.REACT_APP_API_INTERNAL_MEMO_BASE;

    // Internal Memo Service
    export const MEMO_SERVICE_VIEW = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list`;
    export const MEMO_SERVICE_VIEW_PAGINATE = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list-all`;
    export const MEMO_SERVICE_CREATE = `${MEMO_SERVICE_BASE}/internal-memo-service/form/add`;
    export const MEMO_SERVICE_DELETE = `${MEMO_SERVICE_BASE}/internal-memo-service/form/delete/`;
    export const MEMO_SERVICE_UPDATE = `${MEMO_SERVICE_BASE}/internal-memo-service/form/update`;
    export const MEMO_SERVICE_FORM_LIST = `${MEMO_SERVICE_BASE}/internal-memo-service/form/listFiles`;
    export const MEMO_SERVICE_FILE_UPLOAD = `${MEMO_SERVICE_BASE}/internal-memo-service/form/file-upload`; 
    export const MEMO_SERVICE_VIEW_BASED_ON_USER = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list/get-userName`;
    export const MEMO_SERVICE_GET_USER_LISTS =  `${MEMO_SERVICE_BASE}/internal-memo-service/form/list/AllUserName`;
    export const MEMO_SERVICE_LOAD_PDF = `${MEMO_SERVICE_BASE}/internal-memo-service/doc/viewpdf`