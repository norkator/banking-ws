'use strict';

import * as moment from 'moment'
import * as xmlBuilder from 'xmlbuilder';
import {SoftwareIdInterface} from '../interfaces';
import {Environment, FileType, Operations, Status, StatusValues} from '../constants';


class CertApplicationRequest {


  constructor() {
  }

  createXmlBody(): string {
    let xml: xmlBuilder.XMLElement = xmlBuilder.create(
      'ApplicationRequest', {version: '1.0', encoding: 'utf-8'}
    );
    return xml.end({pretty: true});
  }

}

export {
  CertApplicationRequest
};
