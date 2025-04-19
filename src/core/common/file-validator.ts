import { FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';
import constant from '../constants/constant';

export class FileTypeValidator extends FileValidator {
  private allowedTypes: string[] = [
    constant.MimeType.PDF,
    constant.MimeType.DOC,
    constant.MimeType.DOCX,
    constant.MimeType.TXT,
  ];

  constructor() {
    super({});
  }

  isValid(
    file?: IFile | IFile[] | Record<string, IFile[]>,
  ): boolean | Promise<boolean> {
    if (!file) return false;

    if (Array.isArray(file)) {
      return file.every((f) => this.allowedTypes.includes(f.mimetype));
    }

    if (typeof file === 'object' && !(file instanceof Buffer)) {
      if ('mimetype' in file) {
        return (
          typeof file.mimetype === 'string' &&
          this.allowedTypes.includes(file.mimetype)
        );
      }

      return Object.values(file)
        .flat()
        .every((f) => this.allowedTypes.includes(f.mimetype));
    }

    return false;
  }

  buildErrorMessage(): string {
    return `Invalid file type. Only PDF, DOC, DOCX and TXT are allowed.`;
  }
}
