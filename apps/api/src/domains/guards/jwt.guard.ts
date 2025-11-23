import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
	private readonly globalPrefix = '/api'; // this ideally would come from a configuration service
	private readonly OPEN_ROUTES = [`${this.globalPrefix}/auth/login`];
	constructor(private readonly jwtService: JwtService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();

		if (this.OPEN_ROUTES.includes(request.url)) {
			return true;
		}

		const authHeader = request.headers.authorization;

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('Invalid token format');
		}

		const token = authHeader.split(' ')[1];

		try {
			request.user = this.jwtService.verifyAsync(token);
			return true;
		} catch (error) {
			console.error('JWT verification error:', error);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
