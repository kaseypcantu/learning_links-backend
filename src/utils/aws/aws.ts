import fs, { PathLike } from 'fs';
import path from 'path';
import AWS from 'aws-sdk';

import { consoleLogger as logger } from '../logger';

import * as util from 'util';
import S3, {
  BucketName,
  ContentType,
  CreateBucketOutput,
  CreateBucketRequest,
  DeleteBucketRequest,
  ListBucketsOutput,
  ListObjectsOutput,
  ListObjectsRequest,
  ObjectKey,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { Request } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import { v4 } from 'uuid';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';

export const aws_config = new AWS.Config({
  region: 'us-east-2',
  logger: console,
});

aws_config.getCredentials((err) => {
  if (err) console.log(err.message, err.stack);
  else {
    logger.debug('AWS CONFIG -> Successfully Loaded!');
  }
});
