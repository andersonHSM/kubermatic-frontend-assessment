import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
	private readonly globalPrefix = '/api'; // this ideally would come from a configuration service
	private readonly OPEN_ROUTES = [`${this.globalPrefix}/auth/login`];
	constructor(private readonly jwtService: JwtService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<Request & { user?: object }>();

		if (this.OPEN_ROUTES.includes(request.url)) {
			return true;
		}

		const token = request.cookies['token'] ?? request.headers.authorization?.split(' ').at(1);

		if (!token) {
			throw new UnauthorizedException('Invalid token format');
		}

		try {
			request.user = this.jwtService.verify(token);
			return true;
		} catch (error) {
			console.error('JWT verification error:', error);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
