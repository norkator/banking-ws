const Commands = {
  uploadFile: 'UploadFile',
  downloadFileList: 'DownloadFileList',
  downloadFile: 'DownloadFile',
  deleteFile: 'DeleteFile',
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
  Commands,
  StatusValues,
  FileTypes,
}
