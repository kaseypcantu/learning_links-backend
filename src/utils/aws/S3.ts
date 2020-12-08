import S3, {
  BucketName,
  ContentType,
  CreateBucketOutput,
  CreateBucketRequest,
  DeleteBucketRequest,
  ListBucketsOutput,
  ListObjectsOutput,
  ListObjectsRequest,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { Request } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk/lib/error';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import AWS from 'aws-sdk';
import { consoleLogger as logger } from '../logger';
import fs from 'fs';
import path from 'path';
import { aws_config } from './aws';

const s3 = new AWS.S3(aws_config);

export interface IS3 {
  createBucket(bucketName: BucketName): Request<S3.Types.CreateBucketOutput, AWSError>;

  listBuckets(): Request<ListBucketsOutput, AWSError>;

  listObjects(bucketName: BucketName): Request<S3.Types.ListObjectsOutput, AWSError>;

  deleteBucket(bucketName: BucketName): Request<{}, AWSError>;

  uploadFile(
    bucketName: BucketName,
    fileName: string,
    contentType?: ContentType | undefined
  ): ManagedUpload;
}

export class S3_Connection implements IS3 {
  public createBucket(bucketName: BucketName): Request<CreateBucketOutput, AWSError> {
    const bucket: CreateBucketRequest = {
      Bucket: bucketName,
    };

    return s3.createBucket(bucket, (err, data) => {
      if (err) {
        logger.error(`S3-CreateBucket ERROR: [${err.code}] -> ${err.message}`, {
          aws_statusCode: err.statusCode,
          region: err.region,
          aws_errorCode: err.code,
          aws_requestId: err.requestId,
          aws_serverTime: err.time,
        });
        return err;
      } else {
        logger.debug('S3-CreateBucket SUCCESS:', data);
        return data;
      }
    });
  }

  public listBuckets(): Request<ListBucketsOutput, AWSError> {
    return s3.listBuckets((err, data) => {
      if (err) {
        // TODO: leave off here on figureing out the listBuckets logic
        logger.error(`S3-ListBuckets ERROR: [${err.code}] -> ${err.message}`, {
          aws_statusCode: err.statusCode,
          region: err.region,
          aws_errorCode: err.code,
          aws_requestId: err.requestId,
          aws_serverTime: err.time,
        });
      } else {
        logger.debug('S3-ListBuckets SUCCESS:', data);
        return data;
      }
    });
  }

  public listObjects(bucketName: BucketName): Request<ListObjectsOutput, AWSError> {
    const bucket: ListObjectsRequest = {
      Bucket: bucketName,
    };

    return s3.listObjects(bucket, (err, data) => {
      if (err) {
        logger.error(`S3-ListObjects ERROR: [${err.code}] -> ${err.message}`, {
          aws_statusCode: err.statusCode,
          region: err.region,
          aws_errorCode: err.code,
          aws_requestId: err.requestId,
          aws_serverTime: err.time,
        });
        return err;
      } else {
        logger.debug(`S3-ListObjects SUCCESS:`, data);
        return data;
      }
    });
  }

  public deleteBucket(bucketName: BucketName): Request<{}, AWSError> {
    const bucket: DeleteBucketRequest = {
      Bucket: bucketName,
    };

    return s3.deleteBucket(bucket, (err, data) => {
      if (err) {
        logger.error(`S3-DeleteBucket ERROR: [${err.code}] -> ${err.message}`, {
          aws_statusCode: err.statusCode,
          region: err.region,
          aws_errorCode: err.code,
          aws_requestId: err.requestId,
          aws_serverTime: err.time,
        });
        return err;
      } else {
        logger.debug('S3-DeleteBucket SUCCESS:', data);
        return data;
      }
    });
  }

  public uploadFile(
    bucketName: BucketName,
    fileName: string,
    contentType?: ContentType | undefined
  ): ManagedUpload {
    const fileStream = fs
      .createReadStream(fileName)
      .on('error', (err) => logger.error('FileStream ERROR:', err));

    const upload: PutObjectRequest = {
      Bucket: bucketName,
      Key: path.basename(fileName),
      Body: fileStream,
    };

    return s3.upload(upload, (err, data) => {
      if (err) {
        logger.error(`S3-Upload ERROR: -> ${err.message}`, err);
        return err;
      } else {
        logger.debug(
          'S3-Upload SUCCESS:',
          {
            'aws_ETag:': data.ETag,
            aws_s3_bucket: data.Bucket,
            aws_s3_key: data.Key,
            aws_Location: data.Location,
          },
          { test: 'information testing' }
        );
        return data;
      }
    });
  }
}

new S3_Connection().listBuckets();
