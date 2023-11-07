import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // HTTP(context)의 역할 -> HTTP 관련된 요청에서만 logger가 실행 됨 , express의 debug 라이브러리와 같은 역할
  use(request: Request, response: Response, next: NextFunction): void {
    const userAgent = request.get('user-agent') || ''; // header에서 가져옴
    const {
      method,
      originalUrl: url,
      params,
      query,
      body,
      headers,
      ip,
    } = request;

    const originalSend = response.send;
    // 응답이 끝났을 때
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    response.send = (responseBody) => {
      const statusCode = response.statusCode;

      // 응답 전송
      response.send = originalSend;
      response.send(responseBody);

      // 로그 남기기
      this.logger.log(`[REQUEST] Params: ${JSON.stringify(params)}`);
      this.logger.log(
        `${method} ${url} ${statusCode} Query: ${JSON.stringify(query)}`,
      );
      this.logger.log(
        `Body: ${JSON.stringify(body)} Headers: ${JSON.stringify(headers)}`,
      );
      this.logger.log(`[RESPONSE] Status:${statusCode} Body: ${responseBody}`);
      return responseBody;
    };

    next();
  }
}
