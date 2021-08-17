const Commands = {
  uploadFile: 'UploadFile',
  downloadFileList: 'DownloadFileList',
  downloadFile: 'DownloadFile',
  deleteFile: 'DeleteFile',
};

const StatusValues = [
  {name: 'WFP', description: 'Waiting for processing'},
  {name: 'WFC', description: 'Waiting for confirmation'},
  {name: 'FWD', description: 'Forwarded to processing'},
  {name: 'DLD', description: 'Downloaded'},
  {name: 'DEL', description: 'Deleted'},
  {name: 'NEW', description: 'New file'},
  {name: 'KIN', description: 'Key-in'},
];

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
