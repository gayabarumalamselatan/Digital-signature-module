export const MEMO_SERVICE_BASE = process.env.REACT_APP_API_INTERNAL_MEMO_BASE;
export const AUTH_SERVICE_BASE = process.env.REACT_APP_API_AUTH_SERVICE_BASE;

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
    export const MEMO_SERVICE_LOAD_PDF = `${MEMO_SERVICE_BASE}/internal-memo-service/doc/viewpdf`;
    export const MEMO_SERVICE_USERNAME_LISTS = `${AUTH_SERVICE_BASE}/auth-service/core-user/list`;
    export const MEMO_SERVICE_SEARCH_NOMOR_SURAT = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list/get-nosurat`;
    export const MEMO_SERVICE_SEARCH_TITLE_SURAT = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list/get-title`;
    export const MEMO_SERVICE_REPORT = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list/statusMemoBy`;
    export const MEMO_SERVICE_REPORT_ALL = `${MEMO_SERVICE_BASE}/internal-memo-service/form/list/statusMemoByAll`;
    export const MEMO_SERVICE_FILE_LISTS = `${MEMO_SERVICE_BASE}/internal-memo-service/form/listFileData`;
    export const MEMO_SERVICE_FILE_FILTER = `${MEMO_SERVICE_BASE}/internal-memo-service/form/listFiles`;
    export const MEMO_SERVICE_FILE_NAME = `${MEMO_SERVICE_BASE}/internal-memo-service/form/listByFileName`;
    export const MEMO_SERVICE_DOWNLOAD_DONE = `${MEMO_SERVICE_BASE}/internal-memo-service/form/download`;
    export const MEMO_SERVICE_VERIFY_DOCUMENT = `${MEMO_SERVICE_BASE}/internal-memo-service/form/VerifyDS`;


    