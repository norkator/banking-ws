export type Bank = 'Samlink';
export type FileType = 'XL' | 'XP' | 'XT';
export type Status = 'NEW' | 'DLD' | 'ALL';


const Operations = {
  uploadFile: 'uploadFile',
  downloadFileList: 'downloadFileList',
  downloadFile: 'downloadFile',
  deleteFile: 'deleteFile',
};

const StatusValues = {
  NEW: 'NEW',
  DLD: 'DLD',
  ALL: 'ALL',
};

const FileTypes = {
  XL: 'XL', // pain.001.001.02 ja .03 | SEPA-XML –tilisiirto (lähetys)
  XP: 'XP', // SEPA-XML -virhepalaute (nouto) | pain.002.001.02 ja .03
  XT: 'XT', // XML-tiliote (nouto) | camt.053.001.02
};


export {
  Operations,
  StatusValues,
  FileTypes,
}
