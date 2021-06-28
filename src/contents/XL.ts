'use strict';

import * as moment from 'moment'
import * as xmlBuilder from 'xmlbuilder';
import {SoftwareIdInterface} from '../interfaces';
import {Environment, FileType, Operations, Status, StatusValues} from '../constants';


/**
 * SEPA-XML –bank transfer
 * pain.001.001.02
 */
class XL {

  test: string;

  constructor(test: string) {
    this.test = test;
  }

  createXmlBody(): string {

  }

}

export {
  XL
};
