import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
  import { isValidObjectId } from 'mongoose'; //აიდ ვალიდურობის შემოწმება
  
  @Injectable()
  export class ValidateObjectIdPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      const { type, data } = metadata;
  
      
      if (
        //როგორი უნდა იყოს, და რას უნდა შეიცავდეს 
        type === 'param' &&
        typeof data === 'string' &&
        data.toLowerCase().includes('id')
      ) {
        if (!isValidObjectId(value)) {
          throw new BadRequestException(
            `The provided ID "${value}" is not a valid MongoDB ObjectId.`,
          );
        }
      }
  
      return value;// თუ id ვალიდურია, აბრუნებს თავდაპირველ მნიშვნელობას
    }
  }
  