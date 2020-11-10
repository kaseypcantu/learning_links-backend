import logger from "../utils/logger";
import {ErrorResponse, PrettyError} from "../utils/errorResponse";
import {ValidateError} from "tsoa";
import {Request, Response, NextFunction} from "express";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(req.url, err);
  if(err instanceof ErrorResponse){
    const errorResponse = err;
    res.status(errorResponse.statusCode).json(errorResponse);
  }else if(err instanceof ValidateError){
    const errorResponse = ErrorResponse.fromValidationError(err);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
  else if(err.status === 401){
    const errorResponse = new ErrorResponse(401,"Unauthorized", [new PrettyError("invalid authentication")]);
    res.status(errorResponse.statusCode).json(errorResponse);
  }
  else if (err.status){
    const errorResponse = new ErrorResponse(err.status,"unknown", [new PrettyError(err.message, err)]);
    res.status(errorResponse.statusCode).json(errorResponse);
  }else{
    const genericError = new ErrorResponse(500,"Server Error", [PrettyError.fromError(err)]);
    res.status(500).json(genericError);
    next();
  }
};
